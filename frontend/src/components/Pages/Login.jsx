import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

const Login = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      if (err.status === 401) setError('Email ou senha incorretos.');
      else setError('Falha ao entrar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Garimpo Musical</h1>
      <p className="auth-subtitle">Faça login pra continuar.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.test"
            required
            autoFocus
          />
        </label>

        <label className="auth-field">
          <span>Senha</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="auth-divider"><span>ou</span></div>

      <button type="button" className="auth-secondary" onClick={onSwitchToRegister}>
        Criar conta
      </button>
    </div>
  );
};

export default Login;
