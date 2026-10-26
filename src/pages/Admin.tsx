import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Trash2, 
  Edit3,
  LogOut, 
  Lock, 
  User as UserIcon,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  ExternalLink,
  Eye,
  EyeOff,
  Briefcase,
  Layers,
  Share2,
  Mail,
  ShoppingBag,
  Plus,
  Save,
  X,
  Settings
} from "lucide-react";
import { storage, ReviewData, ServiceData, ProjectData, SocialLinkData, ContactSubmission, ProductData, AdminConfig, TradeData, StatData } from "../services/storage";

type TabType = "reviews" | "services" | "projects" | "social" | "contact" | "products" | "trades" | "stats" | "settings";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("reviews");
  
  // Data states
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [stats, setStats] = useState<StatData[]>([]);
  const [adminConfig, setAdminConfig] = useState<AdminConfig[]>([]);

  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<TabType | null>(null);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [newEntry, setNewEntry] = useState<any>({});
  
  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("orynx_admin_session");
    if (session === "true") {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchAllData();
  }, [isLoggedIn]);

  const fetchAllData = async () => {
    const [revs, servs, projs, socs, subs, prods, trds, stts, conf] = await Promise.all([
      storage.getReviews(),
      storage.getServices(),
      storage.getProjects(),
      storage.getSocialLinks(),
      storage.getContactSubmissions(),
      storage.getProducts(),
      storage.getTrades(),
      storage.getStats(),
      storage.getAdminConfig()
    ]);
    setReviews(revs);
    setServices(servs);
    setProjects(projs);
    setSocialLinks(socs);
    setSubmissions(subs);
    setProducts(prods);
    setTrades(trds);
    setStats(stts);
    setAdminConfig(conf);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    
    // Fetch admin config from sheet for verification
    const configs = await storage.getAdminConfig();
    const validUser = configs.find(c => c.username.toLowerCase() === username.toLowerCase() && c.password === password);

    if (validUser || (username.toLowerCase() === "rahin" && password === "rahin5566")) {
      setIsLoggedIn(true);
      localStorage.setItem("orynx_admin_session", "true");
    } else {
      setLoginError("Invalid User ID or password.");
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("orynx_admin_session");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddModal) return;
    
    setIsProcessing(editingEntry ? "updating" : "adding");
    const sheetName = showAddModal.charAt(0).toUpperCase() + showAddModal.slice(1);
    // Special case for tab names vs sheet names
    const sheetMap: Record<string, string> = {
      "social": "SocialLinks",
      "contact": "ContactSubmissions",
      "projects": "Projects",
      "reviews": "Reviews",
      "services": "Services",
      "products": "Products",
      "trades": "Trades",
      "settings": "AdminConfig"
    };
    
    const targetSheet = sheetMap[showAddModal] || sheetName;
    
    let success = false;
    if (editingEntry) {
      success = await storage.updateData(targetSheet, editingEntry.id, newEntry);
    } else {
      success = await storage.addData(targetSheet, newEntry);
    }
    
    if (success) {
      setShowAddModal(null);
      setEditingEntry(null);
      setNewEntry({});
      fetchAllData(); // Refresh list
    } else {
      alert(`Failed to ${editingEntry ? 'update' : 'add'} item. Please check your Google Sheets API URL.`);
    }
    setIsProcessing(null);
  };

  const handleDelete = async (sheet: string, id: string, setter: any) => {
    if (!window.confirm(`Are you sure you want to delete this item from ${sheet}?`)) return;
    setIsProcessing(id);
    const success = await storage.deleteData(sheet, id);
    if (success) {
      setter((prev: any[]) => prev.filter(item => item.id !== id));
    } else {
      alert("Failed to delete item.");
    }
    setIsProcessing(null);
  };

  // Renderers for each tab
  const renderReviews = () => (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" /> Manage Reviews
        </h2>
        <button 
          onClick={() => { setShowAddModal("reviews"); setNewEntry({ rating: 5 }); }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-sm font-medium uppercase tracking-wider border-b border-white/5">
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Content</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reviews.map((review) => (
              <tr key={review.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-white">{review.name}</div>
                  <div className="text-xs text-slate-500">{review.role}</div>
                </td>
                <td className="px-6 py-4 max-w-md">
                  <p className="text-slate-400 text-sm line-clamp-2 italic">"{review.content}"</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full ${i < review.rating ? 'bg-cyan-500' : 'bg-slate-700'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 text-right">
                    <button 
                      onClick={() => {
                        setEditingEntry(review);
                        setNewEntry(review);
                        setShowAddModal("reviews");
                      }}
                      className="p-2 text-slate-500 hover:text-brand-accent transition-all"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete("Reviews", review.id, setReviews)}
                      disabled={isProcessing === review.id}
                      className="p-2 text-slate-500 hover:text-red-400 transition-all"
                    >
                      {isProcessing === review.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" /> Manage Services
        </h2>
        <button 
          onClick={() => { setShowAddModal("services"); setNewEntry({ order: services.length + 1 }); }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div key={service.id} className="glass-card p-4 flex justify-between items-start">
            <div>
              <h3 className="text-white font-bold mb-1">{service.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2">{service.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={() => {
                  setEditingEntry(service);
                  setNewEntry(service);
                  setShowAddModal("services");
                }}
                className="p-2 text-slate-500 hover:text-brand-accent"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete("Services", service.id, setServices)}
                className="p-2 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-cyan-400" /> Manage Showcase
        </h2>
        <button 
          onClick={() => { setShowAddModal("projects"); setNewEntry({ order: projects.length + 1 }); }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="glass-card overflow-hidden group">
            <div className="aspect-video relative">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button 
                  onClick={() => {
                    setEditingEntry(project);
                    setNewEntry(project);
                    setShowAddModal("projects");
                  }}
                  className="p-2 bg-brand-accent/20 text-brand-accent rounded-lg hover:bg-brand-accent/40"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete("Projects", project.id, setProjects)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-bold">{project.title}</h3>
              <p className="text-cyan-400 text-xs font-medium uppercase mb-2">{project.category}</p>
              <div className="flex flex-wrap gap-2">
                {project.websiteLink && <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400">Web</span>}
                {project.appDownload && <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400">App</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-cyan-400" /> Social Media Links
        </h2>
        <button 
          onClick={() => { setShowAddModal("social"); setNewEntry({ order: socialLinks.length + 1 }); }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>
      <div className="p-6 space-y-4">
        {socialLinks.map((link) => (
          <div key={link.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-cyan-400 overflow-hidden">
                {link.image ? (
                  <img src={link.image} alt={link.platform} className="w-full h-full object-cover" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-white font-bold">{link.platform}</h3>
                <p className="text-slate-500 text-sm">{link.url}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setEditingEntry(link);
                  setNewEntry(link);
                  setShowAddModal("social");
                }}
                className="p-2 text-slate-500 hover:text-brand-accent"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete("SocialLinks", link.id, setSocialLinks)}
                className="p-2 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-cyan-400" /> Contact Submissions
        </h2>
      </div>
      <div className="p-6 space-y-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-bold text-lg">{sub.subject}</h3>
                <p className="text-cyan-400 text-sm">{sub.name} ({sub.email})</p>
              </div>
              <button 
                onClick={() => handleDelete("ContactSubmissions", sub.id, setSubmissions)}
                className="p-2 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-400 text-sm bg-white/5 p-4 rounded-xl italic">"{sub.message}"</p>
            <div className="mt-4 text-xs text-slate-600">Received: {new Date(sub.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-cyan-400" /> Manage Products
        </h2>
        <button 
          onClick={() => { setShowAddModal("products"); setNewEntry({ order: products.length + 1 }); }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div key={product.id} className="glass-card p-4 flex gap-4">
            <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="text-white font-bold">{product.name}</h3>
                <span className="text-cyan-400 font-bold">{product.price}</span>
              </div>
              <p className="text-slate-500 text-xs line-clamp-2 mt-1">{product.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setEditingEntry(product);
                  setNewEntry(product);
                  setShowAddModal("products");
                }}
                className="p-2 text-slate-500 hover:text-brand-accent self-start"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete("Products", product.id, setProducts)}
                className="p-2 text-slate-500 hover:text-red-400 self-start"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrades = () => (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-cyan-400" /> Manage Trades
        </h2>
        <button 
          onClick={() => { setShowAddModal("trades"); setNewEntry({ likes: 0 }); }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Trade
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 gap-6">
        {trades.map((trade) => (
          <div key={trade.id} className="glass-card p-4 flex gap-4">
            {trade.image && (
              <div className="w-24 h-24 bg-white/5 rounded-xl overflow-hidden shrink-0">
                <img src={trade.image} alt={trade.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="text-white font-bold">{trade.title}</h3>
                <span className="text-slate-500 text-xs">{new Date(trade.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2 mt-2">{trade.content}</p>
              <div className="mt-2 text-xs text-brand-accent font-medium">{trade.likes || 0} Likes</div>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setEditingEntry(trade);
                  setNewEntry(trade);
                  setShowAddModal("trades");
                }}
                className="p-2 text-slate-500 hover:text-brand-accent self-start"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete("Trades", trade.id, setTrades)}
                className="p-2 text-slate-500 hover:text-red-400 self-start"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="industrial-card overflow-hidden border-white/5">
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
        <div>
           <h2 className="text-xl font-display font-light text-white tracking-widest uppercase flex items-center gap-3">
             <LayoutDashboard className="w-4 h-4 text-brand-accent" /> SYSTEM_STATS
           </h2>
           <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mt-1">Numerical infrastructure data</p>
        </div>
        <button 
          onClick={() => { setShowAddModal("stats"); setNewEntry({ order: stats.length + 1 }); }}
          className="flex items-center gap-2 px-6 py-2 border border-brand-accent text-brand-accent font-mono text-[10px] tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-all"
        >
          <Plus className="w-3 h-3" /> REGISTER_DATA
        </button>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.map((stat) => (
          <div key={stat.id} className="p-8 border border-white/5 flex justify-between items-start group hover:border-brand-accent/30 transition-all">
            <div>
              <h3 className="text-4xl font-display font-light text-white mb-2 tracking-tighter">{stat.value}</h3>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">{stat.label}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setEditingEntry(stat);
                  setNewEntry(stat);
                  setShowAddModal("stats");
                }}
                className="w-10 h-10 border border-white/5 flex items-center justify-center text-slate-700 hover:text-brand-accent hover:border-brand-accent/30 transition-all"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete("Stats", stat.id, setStats)}
                className="w-10 h-10 border border-white/5 flex items-center justify-center text-slate-700 hover:text-red-400 hover:border-red-400/30 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" /> Admin Settings
        </h2>
        <button 
          onClick={() => { setShowAddModal("settings"); setNewEntry({}); }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Admin
        </button>
      </div>
      <div className="p-6 space-y-6">
        <div className="glass-card p-6">
          <h3 className="text-white font-bold mb-4">Admin Accounts</h3>
          <div className="space-y-4">
            {adminConfig.map((config) => (
              <div key={config.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-white">{config.username}</span>
                </div>
                <button 
                  onClick={() => handleDelete("AdminConfig", config.id, setAdminConfig)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddModal = () => {
    if (!showAddModal) return null;

    const fields: Record<TabType, { name: string; label: string; type: string; placeholder?: string }[]> = {
      reviews: [
        { name: "name", label: "Client Name", type: "text", placeholder: "e.g. John Doe" },
        { name: "role", label: "Role/Company", type: "text", placeholder: "e.g. CEO, Tech Corp" },
        { name: "content", label: "Review Content", type: "textarea", placeholder: "What did they say?" },
        { name: "rating", label: "Rating (1-5)", type: "number" },
        { name: "image", label: "Image URL", type: "text", placeholder: "https://..." },
      ],
      services: [
        { name: "title", label: "Service Title", type: "text", placeholder: "e.g. Web Development" },
        { name: "description", label: "Description", type: "textarea", placeholder: "What do you offer?" },
        { name: "icon", label: "Lucide Icon Name", type: "text", placeholder: "e.g. Code, Smartphone" },
        { name: "order", label: "Display Order", type: "number" },
      ],
      projects: [
        { name: "title", label: "Project Title", type: "text", placeholder: "e.g. E-commerce App" },
        { name: "category", label: "Category", type: "text", placeholder: "e.g. Mobile App" },
        { name: "description", label: "Description", type: "textarea", placeholder: "Project details..." },
        { name: "image", label: "Image URL", type: "text", placeholder: "https://..." },
        { name: "tags", label: "Tags (comma separated)", type: "text", placeholder: "React, Node, Tailwind" },
        { name: "websiteLink", label: "Website Link", type: "text", placeholder: "https://..." },
        { name: "appDownload", label: "App Download Link", type: "text", placeholder: "https://..." },
        { name: "order", label: "Display Order", type: "number" },
      ],
      social: [
        { name: "platform", label: "Platform Name", type: "text", placeholder: "e.g. Facebook" },
        { name: "url", label: "Profile URL", type: "text", placeholder: "https://..." },
        { name: "icon", label: "Lucide Icon Name", type: "text", placeholder: "e.g. Facebook, Twitter" },
        { name: "image", label: "Logo Image URL (Optional)", type: "text", placeholder: "https://..." },
        { name: "order", label: "Display Order", type: "number" },
      ],
      products: [
        { name: "name", label: "Product Name", type: "text", placeholder: "e.g. Premium Plan" },
        { name: "description", label: "Description", type: "textarea", placeholder: "Product details..." },
        { name: "price", label: "Price", type: "text", placeholder: "e.g. $99/mo" },
        { name: "image", label: "Image URL", type: "text", placeholder: "https://..." },
        { name: "order", label: "Display Order", type: "number" },
      ],
      trades: [
        { name: "title", label: "Trade Title", type: "text", placeholder: "e.g. Market Update" },
        { name: "content", label: "Content", type: "textarea", placeholder: "Write your trade update here..." },
        { name: "image", label: "Image URL (Optional)", type: "text", placeholder: "https://..." },
      ],
      stats: [
        { name: "value", label: "Stat Value", type: "text", placeholder: "e.g. 150+" },
        { name: "label", label: "Stat Label", type: "text", placeholder: "e.g. Projects Delivered" },
        { name: "order", label: "Display Order", type: "number" },
      ],
      settings: [
        { name: "username", label: "New Username", type: "text" },
        { name: "password", label: "New Password", type: "password" },
      ],
      contact: [] // Submissions are read-only
    };

    const currentFields = fields[showAddModal];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-black/95 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="industrial-card w-full max-w-2xl max-h-[90vh] overflow-y-auto border-white/10"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-brand-black z-10">
            <div>
               <h2 className="text-xl font-display font-light text-white tracking-widest uppercase">
                 {editingEntry ? 'EDIT_ENTRY' : 'ADD_ENTRY'} // {showAddModal}
               </h2>
               <p className="text-[10px] font-mono text-slate-700 tracking-widest mt-1 uppercase">
                 {editingEntry ? 'Synchronizing dataset changes...' : 'Allocating database resources...'}
               </p>
            </div>
            <button onClick={() => { setShowAddModal(null); setEditingEntry(null); }} className="w-10 h-10 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleAdd} className="p-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {currentFields.map((field) => (
                <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-600 block mb-3">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea 
                      required
                      value={newEntry[field.name] || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, [field.name]: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-brand-accent transition-all font-light placeholder:text-slate-800 min-h-[120px] resize-none"
                      placeholder={field.placeholder || `ENTER_${field.name.toUpperCase()}`}
                    />
                  ) : (
                    <input 
                      required
                      type={field.type}
                      value={newEntry[field.name] || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, [field.name]: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-brand-accent transition-all font-light placeholder:text-slate-800"
                      placeholder={field.placeholder || `INPUT_${field.name.toUpperCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-6 pt-8">
              <button 
                type="button"
                onClick={() => { setShowAddModal(null); setEditingEntry(null); }}
                className="flex-1 px-8 py-5 border border-white/5 font-mono text-[10px] uppercase tracking-widest text-slate-600 hover:text-white hover:bg-white/[0.02] transition-all"
              >
                Abort
              </button>
              <button 
                disabled={isProcessing === "adding" || isProcessing === "updating"}
                className="flex-2 bg-white text-brand-black px-10 py-5 rounded-sm font-bold flex items-center justify-center gap-3 hover:bg-brand-accent hover:text-white transition-all uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {isProcessing === "adding" || isProcessing === "updating" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> 
                    {editingEntry ? 'UPDATE_DATABASE' : 'COMMIT_DATA'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-brand-black pt-32 pb-24 flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="industrial-card p-12 md:p-16 text-center max-w-md w-full border-white/5"
        >
          <div className="w-16 h-16 border border-brand-accent flex items-center justify-center text-brand-accent mx-auto mb-8">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-display font-light text-white mb-2 tracking-tighter uppercase">SECURE_ACCESS_REQUIRED</h2>
          <p className="text-slate-500 mb-12 text-[10px] font-mono uppercase tracking-[0.2em]">
            Authorized Personnel Only // Orynx_Digital_Systems
          </p>
          
          <form onSubmit={handleLogin} className="space-y-8 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Identity_Record</label>
              <div className="relative">
                <input 
                  required
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-brand-accent transition-all font-light placeholder:text-slate-800"
                  placeholder="USER_ID_HEX"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Security_Key</label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-brand-accent transition-all font-light placeholder:text-slate-800"
                  placeholder="PASS_STRING"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-700 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="text-red-400 font-mono text-[9px] uppercase tracking-widest bg-red-400/5 p-4 border-l border-red-400">
                CRITICAL_ERR: {loginError}
              </div>
            )}

            <button 
              disabled={isLoggingIn}
              className="w-full bg-white text-brand-black py-5 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-brand-accent hover:text-white transition-all uppercase tracking-widest text-xs mt-4 disabled:opacity-50"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Interface"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-20">
          <div>
            <div className="flex items-center gap-4 mb-4">
               <span className="section-label !mb-0">[ SYSTEM_OVERRIDE ]</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-light text-white tracking-tighter leading-none">Global <span className="text-slate-500 italic">Command</span>.</h1>
            <p className="text-slate-600 font-mono text-[10px] uppercase tracking-widest mt-4">Node_Connected // Data_Relay_Active</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-8 py-3 border border-white/5 text-slate-500 hover:text-white hover:border-white transition-all text-[11px] font-mono uppercase tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5" /> Termination_Sequence
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0 custom-scrollbar border-t border-white/5 lg:border-t-0 lg:border-l lg:pl-4">
            {[
              { id: "reviews", label: "RECORDS_REVIEWS", icon: MessageSquare },
              { id: "services", label: "RECORDS_SERVICES", icon: Layers },
              { id: "projects", label: "RECORDS_SHOWCASE", icon: Briefcase },
              { id: "trades", label: "RECORDS_TRADES", icon: Share2 },
              { id: "stats", label: "RECORDS_STATS", icon: LayoutDashboard },
              { id: "social", label: "RECORDS_SOCIAL", icon: Share2 },
              { id: "contact", label: "RECORDS_SUBMISSIONS", icon: Mail },
              { id: "products", label: "RECORDS_PRODUCTS", icon: ShoppingBag },
              { id: "settings", label: "SYSTEM_CONFIG", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-shrink-0 lg:w-full flex items-center gap-4 px-4 py-4 font-mono text-[10px] tracking-widest transition-all text-left uppercase ${
                  activeTab === tab.id 
                    ? "text-brand-accent bg-brand-accent/5 border-l-2 border-brand-accent" 
                    : "text-slate-600 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
            
            <div className="lg:mt-8 flex-shrink-0">
              <button 
                onClick={fetchAllData}
                className="h-full lg:w-full flex items-center justify-center gap-3 px-4 py-4 bg-white/[0.02] text-slate-600 hover:text-white transition-all text-[10px] font-mono uppercase tracking-widest border border-white/5 whitespace-nowrap"
              >
                <Loader2 className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                FORCE_RELOAD
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="min-h-[400px]"
              >
                {activeTab === "reviews" && renderReviews()}
                {activeTab === "services" && renderServices()}
                {activeTab === "projects" && renderProjects()}
                {activeTab === "social" && renderSocial()}
                {activeTab === "contact" && renderContact()}
                {activeTab === "products" && renderProducts()}
                {activeTab === "trades" && renderTrades()}
                {activeTab === "stats" && renderStats()}
                {activeTab === "settings" && renderSettings()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {renderAddModal()}
    </div>
  );
}
