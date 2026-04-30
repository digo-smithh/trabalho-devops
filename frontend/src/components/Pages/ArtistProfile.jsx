import React, { useState, useEffect } from 'react';
import '../../styles/artist_profile.css';

const ArtistProfile = ({ artistId }) => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('songs');

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/home/artists/${artistId}`);

        if (!response.ok) throw new Error('Erro ao carregar artista');

        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    if (artistId) {
      fetchArtistData();
    }
  }, [artistId]);

  if (loading) return <div className="loading">Carregando perfil...</div>;
  if (!artist) return <div className="error">Artista não encontrado.</div>;

  const handleSpotifyView = () => {
    if (artist.spotifyId) {
      window.open(`https://open.spotify.com/artist/${artist.spotifyId}`, "_blank");
    }
  };

  const handleSongClick = (spotifyUrl) => {
    if (spotifyUrl) {
      window.open(spotifyUrl, "_blank");
    }
  };

  const renderSongItem = (song, index) => (
    <div
      className="song-item"
      key={song.id}
      onClick={() => handleSongClick(song.spotifyUrl)}
      style={{ cursor: 'pointer' }}
    >
      <span className="song-index">{index + 1}</span>
      <div className="song-item-icon">
        <img src="/assets/music.svg" width="20" height="20" alt="Ícone" />
      </div>
      <div className="song-item-details">
        <h4>{song.name}</h4>
        <p>{song.playCount} reproduções</p>
      </div>
      <span className="song-item-duration">{song.duration}</span>
    </div>
  );

  return (
    <>
      <div className="artist-header">
        <img
          src="/assets/banner.png"
          alt="Banner"
          className="profile-banner-img"
        />

        <div className="artist-header-content">
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="profile-picture"
          />
          <div className="profile-info">
            <p className="subtitle">{artist.genre} • {artist.city}, {artist.state}</p>
            <h1>{artist.name}</h1>

            <div className="profile-stats">
                <span><strong>{artist.songs.length}</strong> músicas</span>
            </div>

            <div className="profile-actions">
              <button className="btn btn-seguir">Seguir</button>
              <button className="btn btn-spotify" onClick={handleSpotifyView}>
                Ver no Spotify
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-bar artist-profile-tab-bar">
        <button
          className={`tab-button ${activeTab === 'songs' ? 'active' : ''}`}
          onClick={() => setActiveTab('songs')}
        >
          Músicas
        </button>
        <button
          className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          Sobre
        </button>
      </div>

      <div className="tab-content-container">
        {activeTab === 'songs' && (
          <div className="tab-content songs-list active">
            {artist.songs.length > 0 ? (
              artist.songs.map((song, index) => renderSongItem(song, index))
            ) : (
              <p style={{padding: '1rem'}}>Nenhuma música encontrada.</p>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="tab-content about-content">
            <h3>Sobre {artist.name}</h3>
            <p>Artista de {artist.genre} originário de {artist.city}.</p>
          </div>
        )}
      </div>

      <br/><br/><br/>
    </>
  );
};

export default ArtistProfile;
