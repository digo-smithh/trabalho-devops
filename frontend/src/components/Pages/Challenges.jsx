import React, { useState } from 'react';
import '../../styles/challenges.css';

const Challenges = () => {
  const [activeTab, setActiveTab] = useState('my-challenges'); 

  const challengesData = [
    { 
      id: 1, 
      iconSrc: "/assets/headphone.svg", 
      title: "Explorador Musical", 
      description: "Ouça 10 artistas novos esta semana", 
      progress: 60, 
      reward: "+100 Pontos",
      type: 'my-challenges'
    },
    { 
      id: 2, 
      iconSrc: "/assets/music.svg", 
      title: "Maratonista do Rock", 
      description: "Ouça 5 músicas de Rock Nacional", 
      progress: 80, 
      reward: "+50 Pontos",
      type: 'my-challenges'
    },
  ];

  const renderChallengeCard = (challenge) => (
    <div className="challenge-card" key={challenge.id}>
      <div className="challenge-card-content">
        <div className="challenge-card-icon">
          <img src={challenge.iconSrc} width="32" height="32" alt="" />
        </div>
        <div className="challenge-card-details">
          <h4>{challenge.title}</h4>
          <p>{challenge.description}</p>
          <div className="challenge-card-progress-info">
            <span>Progresso</span>
            <span>{challenge.progress}%</span>
          </div>
          <div className="challenge-card-progress-bar-bg">
            <div 
              className="challenge-card-progress-bar-fg" 
              style={{ width: `${challenge.progress}%` }}
            ></div>
          </div>
          <div className="challenge-card-reward">
            {challenge.reward}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="page-header">
        <div className="page-header-title">
          <div className="icon-bg">
            <img src="/assets/trophy.svg" width="32" height="32" alt="Ícone de Troféu" />
          </div>
          <h1>Desafios de hoje</h1>
        </div>
        <p className="page-header-subtitle">
          Complete desafios e convide seus amigos para participar!
        </p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Pontos Totais</p>
          <p>2.450</p>
        </div>
        <div className="stat-card">
          <p>Concluídos</p>
          <p>18</p>
        </div>
      </div>

      <div className="tab-bar">
        <button 
          className={`tab-button ${activeTab === 'my-challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-challenges')}
          data-tab="my-challenges"
        >
          Meus Desafios
        </button>
        <button 
          className={`tab-button ${activeTab === 'group-challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('group-challenges')}
          data-tab="group-challenges"
        >
          Desafios em Grupo
        </button>
      </div>

      <div 
        id="my-challenges" 
        className={`tab-content ${activeTab === 'my-challenges' ? 'active' : ''}`}
      >
        <div className="challenges-list">
          {challengesData
            .filter(c => c.type === 'my-challenges')
            .map(renderChallengeCard)}
        </div>
      </div>

      <div 
        id="group-challenges" 
        className={`tab-content ${activeTab === 'group-challenges' ? 'active' : ''}`}
      >
        <div className="challenges-list">
          <p style={{ padding: '1rem', textAlign: 'center' }}>Nenhum desafio em grupo disponível.</p>
        </div>
      </div>
    </>
  );
};

export default Challenges;