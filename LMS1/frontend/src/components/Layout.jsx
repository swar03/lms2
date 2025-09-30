import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <main className="pt-16"> {/* Padding to offset the fixed navbar */}
        {children}
      </main>
    </div>
  );
};

export default Layout;