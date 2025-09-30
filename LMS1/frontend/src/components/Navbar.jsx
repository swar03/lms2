import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import bgImage from '../assets/logo.png';
import Notifications from './Notifications';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('You have been logged out.');
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-gray-900 shadow-lg fixed w-full top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 text-white text-2xl font-bold" style={{ backgroundImage:  `url(${bgImage})` }}>
              CyberLMS
            </Link>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Notifications />
              
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-9 w-9 rounded-full object-cover"
                    src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=4f46e5&color=fff`}
                    alt="User avatar"
                  />
                  <span className="hidden md:block ml-3 text-white font-medium">{user.name}</span>
                  <svg className={`hidden md:block ml-1 h-5 w-5 text-white transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <Link
                      to="/dashboard"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {user.role === 'MANAGER' && (
                      <Link
                        to="/manager-dashboard"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Manager Dashboard
                      </Link>
                    )}
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin-dashboard"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;