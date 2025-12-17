"use client";

import React, { useState } from "react";
import { Home, Package, Phone, Info, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Header({ onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    { label: "خانه", key: "home", icon: <Home size={20} className="text-pink-400" /> },
    { label: "محصولات", key: "products", icon: <Package size={20} className="text-green-400" /> },
    { label: "تماس با ما", key: "allfan", icon: <Phone size={20} className="text-purple-400" /> },
    { label: "درباره ما", key: "aboutus", icon: <Info size={20} className="text-yellow-400" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-gray-900/80 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-3 select-none p-2 md:p-3">
          <div className="bg-gray-900/80 rounded-full p-1 flex items-center justify-center border border-gray-700">
            <img
              src="./images/ftpe.png"
              alt="Logo"
              className="w-12 h-12 md:w-16 md:h-16 bg-slate-200 rounded-full object-contain filter brightness-150"
            />
          </div>
          <h2 className="text-slate-200 font-semibold md:text-lg">فن آوران تهویه پیام</h2>
        </motion.div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-4">
          {menu.map((item, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(item.key)}
              className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl bg-gray-800/70 hover:bg-gray-700 transition-all shadow-md border border-gray-600"
            >
              {item.icon}
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="p-2 rounded-lg bg-gray-900/90 text-white hover:bg-gray-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden md:hidden bg-gray-900 border-t border-gray-700"
      >
        <nav className="flex flex-col gap-2 p-4">
          {menu.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { onNavigate(item.key); setMobileOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-900/80 hover:bg-gray-800 text-white font-medium"
            >
              {React.cloneElement(item.icon, { className: "text-white" })}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </motion.div>
    </header>
  );
}
