import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import '../../styles/auth.css';

const AuthScreen = () => {
  const [mode, setMode] = useState('login');

  return (
    <div className="auth-screen">
      <div className="auth-bg" aria-hidden="true">
        <div className="auth-bg-glow auth-bg-glow-a" />
        <div className="auth-bg-glow auth-bg-glow-b" />
      </div>
      <div className="auth-shell">
        {mode === 'login'
          ? <Login onSwitchToRegister={() => setMode('register')} />
          : <Register onSwitchToLogin={() => setMode('login')} />}
      </div>
    </div>
  );
};

export default AuthScreen;
