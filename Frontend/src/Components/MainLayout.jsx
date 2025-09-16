// MainLayout.jsx - Final Component
import React, { useState, useEffect } from 'react';
import NavbarTop from './NavbarTop';
import Sidebar from './Sidebar';
import './sidebar.css';

const MainLayout = ({ children, onPageChange }) => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [sidebarShow, setSidebarShow] = useState(false);

  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
    
    // If using simple state management
    if (onPageChange) {
      onPageChange(itemId);
    }
    
    // Close sidebar on mobile after menu click
    if (window.innerWidth <= 991.98) {
      setSidebarShow(false);
    }
    
    console.log('Menu clicked:', itemId);
  };

  const toggleSidebar = () => {
    setSidebarShow(!sidebarShow);
  };

  const closeSidebar = () => {
    setSidebarShow(false);
  };

  // Close sidebar when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991.98) {
        setSidebarShow(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarShow && window.innerWidth <= 991.98) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarShow]);

  return (
    <div className="app-layout">
      {/* Fixed Navbar */}
      <NavbarTop onToggleSidebar={toggleSidebar} />
      
      {/* Fixed Sidebar */}
      <Sidebar 
        onMenuClick={handleMenuClick} 
        activeItem={activeItem}
        show={sidebarShow}
        onHide={closeSidebar}
      />
      
      {/* Backdrop for mobile */}
      <div 
        className={`sidebar-backdrop ${sidebarShow ? 'show' : ''}`}
        onClick={closeSidebar}
      />
      
      {/* Main Content Area */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;