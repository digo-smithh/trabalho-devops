import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Avatar } from '../Avatar';
import '../../styles/side_navbar.css';

const Sidebar = ({ activePage, onNavigate }) => {
  const { user, logout } = useAuth();

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
          onClick={() => onNavigate('following')}
          className={`sidebar-tab ${activePage === 'following' ? 'active' : ''}`}
        >
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>Seguindo</span>
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

      {user && (
        <div className="sidebar-profile">
          <div className="sidebar-profile-info">
            <Avatar avatarKey={user.avatarKey} size={40} ring />
            <div className="sidebar-profile-text">
              <span className="sidebar-profile-name">{user.name}</span>
              <span className="sidebar-profile-email">{user.email}</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-logout"
            onClick={logout}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sair
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
