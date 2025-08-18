// src/components/Navbar.jsx
import React, { useState } from "react";
import { 
  Home, 
  User, 
  Search, 
  BookOpen, 
  GraduationCap, 
  Menu, 
  X, 
  Shield,
  ChevronDown 
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: <Home size={18} />, path: "/" },
    { name: "Training", icon: <BookOpen size={18} />, path: "/training" },
    { name: "Training & Internship", icon: <GraduationCap size={18} />, path: "/training-internship" },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 shadow-xl border-b border-white/10 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="CyberEdu Logo" 
              className="w-8 h-8 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              CyberEdu
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors duration-300 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses, topics..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Side - Teach & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Teach Button */}
            <a 
              href="/teach" 
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Teach on CSI
            </a>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <User className="w-5 h-5 text-white" />
                <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl overflow-hidden">
                  <a
                    href="/login"
                    className="block px-4 py-3 text-white hover:bg-white/20 transition-colors duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Sign In
                  </a>
                  <a
                    href="/login"
                    className="block px-4 py-3 text-white hover:bg-white/20 transition-colors duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Create Account
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mobile Navigation Items */}
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </a>
            ))}

            {/* Mobile Teach Button */}
            <a
              href="/teach"
              className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Teach on CSI
            </a>

            {/* Mobile Profile */}
            <a
              href="/login"
              className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Sign In</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}