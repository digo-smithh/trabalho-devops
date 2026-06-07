import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import BottomNavbar from './components/Layout/BottomNavbar';
import Home from './components/Pages/Home';
import Challenges from './components/Pages/Challenges';
import ArtistProfile from './components/Pages/ArtistProfile';
import AuthScreen from './components/Pages/AuthScreen';
import { useAuth } from './auth/AuthContext';

function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedArtistId, setSelectedArtistId] = useState(null);

  const handleNavigate = (page, dataId = null) => {
    setCurrentPage(page);
    if (dataId) setSelectedArtistId(dataId);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="main-loading">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'challenges':
        return <Challenges />;
      case 'artist':
        return <ArtistProfile artistId={selectedArtistId} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Sidebar
        activePage={currentPage}
        onNavigate={(page) => handleNavigate(page)}
      />

      <main className="main">
        {renderPage()}
      </main>

      <BottomNavbar
        activePage={currentPage}
        onNavigate={(page) => handleNavigate(page)}
      />
    </>
  );
}

export default App;
