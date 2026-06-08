import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import '../../styles/following.css';

const Following = ({ onNavigate }) => {
  const [artists, setArtists] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api('/me/following');
        if (active) setArtists(data);
      } catch (err) {
        if (active) setError('Não foi possível carregar.');
      }
    })();
    return () => { active = false; };
  }, []);

  if (error) {
    return <div className="main-error"><p>{error}</p></div>;
  }

  if (artists === null) {
    return (
      <div className="main-loading">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <>
        <header className="page-header">
          <h1>Seguindo</h1>
        </header>
        <div className="following-empty">
          <div className="following-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h2>Vish, você ainda não segue ninguém</h2>
          <p>Bora explorar a home e achar uns artistas?</p>
          <button className="following-empty-cta" onClick={() => onNavigate('home')}>
            Ir para a Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="page-header">
        <h1>Seguindo</h1>
        <p className="page-header-subtitle">{artists.length} {artists.length === 1 ? 'artista' : 'artistas'}</p>
      </header>

      <div className="following-grid">
        {artists.map(a => (
          <div
            key={a.id}
            className="following-card"
            onClick={() => onNavigate('artist', a.id)}
          >
            <div className="following-card-image">
              <img src={a.imageUrl} alt={a.name} />
            </div>
            <h4>{a.name}</h4>
            <p>{a.genre} • {a.city}, {a.state}</p>
          </div>
        ))}
      </div>

      <br /><br /><br />
    </>
  );
};

export default Following;
