import React from 'react';
import '../../styles/side_navbar.css';

const Sidebar = ({ activePage, onNavigate }) => {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Garimpo musical</h1>
      </div>

      <nav className="sidebar-nav">
        <a 
          href="#"
          onClick={() => onNavigate('home')}
          className={`sidebar-tab ${activePage === 'home' ? 'active' : ''}`}
        >
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home</span>
        </a>
        <a 
          href="#"
          onClick={() => onNavigate('challenges')}
          className={`sidebar-tab ${activePage === 'challenges' ? 'active' : ''}`}
        >
          <img src="/assets/trophy.svg" width="24" height="24" alt="" /> 
          <span>Desafios</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;