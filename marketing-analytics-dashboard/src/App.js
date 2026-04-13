// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Instagram, Youtube, Megaphone,
  BarChart3, Menu, X, Zap, ChevronRight,
} from "lucide-react";
import Overview from "./pages/Overview";
import InstagramPage from "./pages/Instagram";
import YouTubePage from "./pages/YouTube";
import Campaigns from "./pages/Campaigns";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/instagram", icon: Instagram, label: "Instagram" },
  { to: "/youtube", icon: Youtube, label: "YouTube" },
  { to: "/campaigns", icon: Megaphone, label: "Campaigns" },
];

function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BarChart3 size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">MarketPulse</p>
            <p className="text-xs text-gray-400">Analytics Dashboard</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Analytics
          </p>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"} />
                  <span>{label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* API Status Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="bg-amber-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={12} className="text-amber-500" />
              <p className="text-xs font-semibold text-amber-700">Mock Data Mode</p>
            </div>
            <p className="text-xs text-amber-600 leading-relaxed">
              Set <code className="bg-amber-100 px-1 rounded">USE_MOCK=false</code> in apiService.js to use real APIs
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenuClick }) {
  const location = useLocation();
  const currentPage = navItems.find(
    (n) => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  );

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900">{currentPage?.label || "Dashboard"}</h1>
          <p className="text-xs text-gray-400">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-500 hidden sm:block">Live (mock)</span>
        </div>
      </div>
    </header>
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/instagram" element={<InstagramPage />} />
            <Route path="/youtube" element={<YouTubePage />} />
            <Route path="/campaigns" element={<Campaigns />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
