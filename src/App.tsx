/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Showcase from "./pages/Showcase";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Review from "./pages/Review";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Admin from "./pages/Admin";
import ProjectDetails from "./pages/ProjectDetails";
import Trades from "./pages/Trades";

import { storage } from "./services/storage";
import { useState } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Subscribe to global sync state
    const unsubscribe = storage.subscribeToSync((syncing) => {
      setIsSyncing(syncing);
    });

    // Start preloading all data as soon as the app boots
    const init = async () => {
      await storage.preloadAll();
      // Small buffer for UX
      setTimeout(() => setIsReady(true), 500);
    };
    init();

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <LoadingScreen isReady={isReady && !isSyncing} />
      <div className="min-h-screen selection:bg-brand-accent/30 selection:text-white flex flex-col bg-brand-black">
        <div className="glow-mesh" />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/review" element={<Review />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
