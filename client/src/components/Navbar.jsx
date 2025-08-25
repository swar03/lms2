import React, { useState } from "react";
import { 
  Home, 
  User, 
  Search, 
  BookOpen, 
  GraduationCap, 
  Menu, 
  X, 
  ChevronDown 
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    // client/src/components/Navbar.jsx (Addition)

// ... inside the navItems array
    
    { name: "Home", icon: <Home size={18} />, path: "/" },
    { name: "Training", icon: <BookOpen size={18} />, path: "/training" },
    { name: "Training & Internship", icon: <GraduationCap size={18} />, path: "/training-internship" },
    { name: "My Learnings", icon: <BookOpen size={18} />, path: "/my-learnings" },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      {/* Container with modified padding and removed horizontal centering */}
      <div className="w-full mx-auto pl-2 pr-4 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left side: Logo + Navlinks */}
          <div className="flex items-center">
            {/* Logo in corner */}
            <a href="/" className="flex items-center group">
              <img 
                src="/logo.png" 
                alt="CyberEdu Logo" 
                className="h-8 sm:h-10 md:h-11 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 ml-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses, topics..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Side - Teach & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Teach Button */}
            <a 
              href="/teach" 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Teach on CSI
            </a>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-all duration-300"
              >
                <User className="w-5 h-5 text-gray-700" />
                <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  <a
                    href="/login"
                    className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Sign In
                  </a>
                  <a
                    href="/login"
                    className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
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
            className="md:hidden p-2 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-all duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mobile Navigation Items */}
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </a>
            ))}

            {/* Mobile Teach Button */}
            <a
              href="/teach"
              className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Teach on CSI
            </a>

            {/* Mobile Profile */}
            <a
              href="/login"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
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