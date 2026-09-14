import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@contexts/ThemeContext.jsx';
import { useRoutes } from '@hooks/useRoutes.js';
import portfolioData from '@data/portfolioData.json';
import './Drawer.css';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
};

const CustomDrawer = ({ isOpen, onToggle, onClose }) => {
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();
  const { getNavigationRoutes } = useRoutes();
  const isMobile = useIsMobile();
  
  // Get menu items from JSON configuration
  const menuItems = getNavigationRoutes();
  // Function to check if a menu item should be active
  const isActive = (itemPath) => {
    const currentPath = location.pathname;
    
    // Handle About page - it should be active for home routes
    if (itemPath === '/about' || itemPath === '/') {
      const isHomePage = currentPath === '/' || currentPath === '/about';
      return isHomePage;
    }
    
    // For other paths, check exact match
    return currentPath === itemPath;
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button 
        className="hamburger-menu"
        onClick={onToggle}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        aria-controls="nav-drawer"
      >
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="drawer-overlay" onClick={onClose}></div>}

      {/* Drawer */}
      <div
        className={`custom-drawer ${isOpen ? 'open' : ''}`}
        id="nav-drawer"
        role="dialog"
        aria-label="Navigation menu"
        aria-hidden={isMobile && !isOpen}
        inert={isMobile && !isOpen}
      >
        <div className="drawer-header">
          <h3>{portfolioData.personal.name}</h3>
          <p>{portfolioData.personal.title}</p>
        </div>
        <div className="drawer-divider"></div>
        <nav className="drawer-nav">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`drawer-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={onClose}
              title={item.description}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="drawer-footer">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <span className="theme-icon">{isDark ? '☀️' : '🌙'}</span>
            <span className="theme-text">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomDrawer;