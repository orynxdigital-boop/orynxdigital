/**
 * Google Sheets Storage Service
 * 
 * This service interacts with a Google Apps Script web app to store and retrieve reviews.
 * 
 * To set up the Google Apps Script:
 * 1. Create a new Google Sheet.
 * 2. Rename the first sheet to "Reviews".
 * 3. Add headers in the first row: id, name, role, content, rating, image, createdAt.
 * 4. Go to Extensions > Apps Script.
 * 5. Paste the following code:
 * 
 * ```javascript
 * function doGet(e) {
 *   var sheetName = e.parameter.sheet || "Reviews";
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
 *   if (!sheet) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
 *   
 *   var data = sheet.getDataRange().getValues();
 *   var headers = data.shift();
 *   var result = data.map(function(row) {
 *     var obj = {};
 *     headers.forEach(function(header, i) {
 *       obj[header] = row[i];
 *     });
 *     return obj;
 *   });
 *   return ContentService.createTextOutput(JSON.stringify(result))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * function doPost(e) {
 *   var params = JSON.parse(e.postData.contents);
 *   var sheetName = params.sheet || "Reviews";
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
 *   if (!sheet) {
 *     sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
 *     // You might want to add headers here manually if it's a new sheet
 *   }
 *   
 *   if (params.action === "add") {
 *     var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
 *     var newRow = headers.map(function(header) {
 *       if (header === "id") return Utilities.getUuid();
 *       if (header === "createdAt") return new Date().toISOString();
 *       return params[header] || "";
 *     });
 *     sheet.appendRow(newRow);
 *     return ContentService.createTextOutput(JSON.stringify({status: "success"}))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 *   
 *   if (params.action === "delete") {
 *     var data = sheet.getDataRange().getValues();
 *     for (var i = 1; i < data.length; i++) {
 *       if (data[i][0] === params.id) {
 *         sheet.deleteRow(i + 1);
 *         break;
 *       }
 *     }
 *     return ContentService.createTextOutput(JSON.stringify({status: "success"}))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * 
 *   if (params.action === "update") {
 *     var data = sheet.getDataRange().getValues();
 *     var headers = data[0];
 *     for (var i = 1; i < data.length; i++) {
 *       if (data[i][0] === params.id) {
 *         headers.forEach(function(header, j) {
 *           if (header !== "id" && params[header] !== undefined) {
 *             sheet.getRange(i + 1, j + 1).setValue(params[header]);
 *           }
 *         });
 *         break;
 *       }
 *     }
 *     return ContentService.createTextOutput(JSON.stringify({status: "success"}))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * ```
 * 6. Click Deploy > New Deployment.
 * 7. Select "Web app".
 * 8. Execute as: "Me", Who has access: "Anyone".
 * 9. Copy the web app URL and add it to your .env as VITE_GOOGLE_SHEETS_API_URL.
 */

// Hardcoded URL fallback so it works automatically on Netlify without environment variable setup
const API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || "https://script.google.com/macros/s/AKfycbwerhLuwejJR6RHu3_-5CVSzMwRe0mDbR6yiTpBFo7BIyePPyfPFeqbgcVSBhk5Wf7m/exec";
console.log("Storage API URL:", API_URL);

// Simple in-memory and session cache to make page loads instant
const memoryCache: Record<string, { data: any[], timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (sheetName: string) => {
  // Check memory cache first
  if (memoryCache[sheetName] && (Date.now() - memoryCache[sheetName].timestamp < CACHE_DURATION)) {
    return memoryCache[sheetName].data;
  }
  
  // Check session storage fallback
  try {
    const sessionData = sessionStorage.getItem(`orynx_cache_${sheetName}`);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        // Restore to memory cache
        memoryCache[sheetName] = parsed;
        return parsed.data;
      }
    }
  } catch (e) {
    // Ignore session storage errors
  }
  
  return null;
};

const setCachedData = (sheetName: string, data: any[]) => {
  const cacheObj = { data, timestamp: Date.now() };
  memoryCache[sheetName] = cacheObj;
  try {
    sessionStorage.setItem(`orynx_cache_${sheetName}`, JSON.stringify(cacheObj));
  } catch (e) {
    // Ignore session storage errors
  }
};

const clearCache = (sheetName: string) => {
  delete memoryCache[sheetName];
  try {
    sessionStorage.removeItem(`orynx_cache_${sheetName}`);
  } catch (e) {
    // Ignore session storage errors
  }
};

let preloadPromise: Promise<void> | null = null;

// Subscriber system for global loading state
type SyncListener = (isSyncing: boolean) => void;
let syncListeners: SyncListener[] = [];
let activeSyncs = 0;

function updateSyncState(isSyncing: boolean) {
  if (isSyncing) activeSyncs++;
  else activeSyncs = Math.max(0, activeSyncs - 1);
  
  const syncing = activeSyncs > 0;
  syncListeners.forEach(listener => listener(syncing));
}

const preloadAllData = async () => {
  if (!API_URL) return;
  if (preloadPromise) return preloadPromise;

  updateSyncState(true);
  preloadPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}?sheet=all&t=${Date.now()}`);
      const allData = await response.json();
      
      if (allData && typeof allData === 'object') {
        Object.keys(allData).forEach(sheetName => {
          const data = Array.isArray(allData[sheetName]) ? allData[sheetName] : [];
          setCachedData(sheetName, data);
        });
      }
    } catch (error) {
      console.error("Error preloading all data:", error);
    } finally {
      updateSyncState(false);
    }
  })();

  return preloadPromise;
};

export interface ReviewData {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  createdAt: string;
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string; // Comma separated
  appDownload?: string;
  websiteLink?: string;
  order: number;
}

export interface SocialLinkData {
  id: string;
  platform: string;
  url: string;
  icon: string;
  image?: string;
  order: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface StatData {
  id: string;
  value: string;
  label: string;
  order: number;
}

export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  order: number;
}

export interface TradeData {
  id: string;
  title: string;
  content: string;
  image: string;
  likes: number;
  createdAt: string;
}

export interface CommentData {
  id: string;
  tradeId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface AdminConfig {
  id: string;
  username: string;
  password: string;
}

export const storage = {
  subscribeToSync: (listener: SyncListener) => {
    syncListeners.push(listener);
    return () => {
      syncListeners = syncListeners.filter(l => l !== listener);
    };
  },
  preloadAll: () => preloadAllData(),

  async getData<T>(sheetName: string, forceRefresh = false): Promise<T[]> {
    if (!API_URL) {
      console.warn("VITE_GOOGLE_SHEETS_API_URL is not defined.");
      return [];
    }

    // Return cached data if it exists and hasn't expired
    if (!forceRefresh) {
      const cached = getCachedData(sheetName);
      if (cached) return cached as T[];
      
      // If no cache but a preload is running, wait for it and check again
      if (preloadPromise) {
        await preloadPromise;
        const cachedAfterPreload = getCachedData(sheetName);
        if (cachedAfterPreload) return cachedAfterPreload as T[];
      } else {
        // Start a preload if nothing is cached yet (first load)
        await preloadAllData();
        const cachedAfterPreload = getCachedData(sheetName);
        if (cachedAfterPreload) return cachedAfterPreload as T[];
      }
    }

    updateSyncState(true);
    try {
      // Add a timestamp to prevent browser caching
      const response = await fetch(`${API_URL}?sheet=${sheetName}&t=${Date.now()}`);
      const data = await response.json();
      const result = Array.isArray(data) ? data : [];
      
      // Save to cache
      setCachedData(sheetName, result);
      
      return result as T[];
    } catch (error) {
      console.error(`Error fetching ${sheetName}:`, error);
      // Fallback to stale cache if available
      const stale = getCachedData(sheetName);
      return stale ? stale as T[] : [];
    } finally {
      updateSyncState(false);
    }
  },

  async addData(sheetName: string, data: any): Promise<boolean> {
    if (!API_URL) return false;
    updateSyncState(true);
    try {
      // Using text/plain is more reliable for no-cors requests to Google Apps Script
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "add", sheet: sheetName, ...data }),
      });
      
      // Invalidate cache for this sheet
      clearCache(sheetName);
      
      return true;
    } catch (error) {
      console.error(`Error adding to ${sheetName}:`, error);
      return false;
    } finally {
      updateSyncState(false);
    }
  },

  async updateData(sheetName: string, id: string, data: any): Promise<boolean> {
    if (!API_URL) return false;
    updateSyncState(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "update", sheet: sheetName, id, ...data }),
      });
      
      // Invalidate cache for this sheet
      clearCache(sheetName);
      
      return true;
    } catch (error) {
      console.error(`Error updating ${sheetName}:`, error);
      return false;
    } finally {
      updateSyncState(false);
    }
  },

  async deleteData(sheetName: string, id: string): Promise<boolean> {
    if (!API_URL) return false;
    updateSyncState(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "delete", sheet: sheetName, id }),
      });
      
      // Invalidate cache for this sheet
      clearCache(sheetName);
      
      return true;
    } catch (error) {
      console.error(`Error deleting from ${sheetName}:`, error);
      return false;
    } finally {
      updateSyncState(false);
    }
  },

  // Specialized helpers
  getReviews: () => storage.getData<ReviewData>("Reviews"),
  getServices: () => storage.getData<ServiceData>("Services"),
  getProjects: () => storage.getData<ProjectData>("Projects"),
  getSocialLinks: () => storage.getData<SocialLinkData>("SocialLinks"),
  getStats: async () => {
    const data = await storage.getData<StatData>("Stats");
    return data.sort((a, b) => a.order - b.order);
  },
  getContactSubmissions: () => storage.getData<ContactSubmission>("ContactSubmissions"),
  getProducts: () => storage.getData<ProductData>("Products"),
  getTrades: () => storage.getData<TradeData>("Trades"),
  getComments: () => storage.getData<CommentData>("Comments"),
  getAdminConfig: () => storage.getData<AdminConfig>("AdminConfig"),
};
