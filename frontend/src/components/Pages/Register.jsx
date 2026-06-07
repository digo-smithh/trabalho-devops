import React, { useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { AVATARS, AvatarPicker } from '../Avatar';

const STRENGTH_LEVELS = [
  { label: 'Muito fraca', color: '#EF4444' },
  { label: 'Fraca',       color: '#F59E0B' },
  { label: 'Média',       color: '#FACC15' },
  { label: 'Forte',       color: '#34D399' },
  { label: 'Muito forte', color: '#10B981' },
];

const scorePassword = (pwd) => {
  if (!pwd) return -1;
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, STRENGTH_LEVELS.length - 1);
};

const Register = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [avatarKey, setAvatarKey] = useState(AVATARS[0].key);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const strengthIdx = useMemo(() => scorePassword(password), [password]);
  const passwordsMatch = confirm.length > 0 && password === confirm;
  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, avatarKey });
    } catch (err) {
      if (err.status === 409) setError('Email já cadastrado.');
      else if (err.status === 400) setError('Dados inválidos.');
      else setError('Falha ao criar conta.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Criar conta</h1>
      <p className="auth-subtitle">Crie sua conta pra começar.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">
          <span>Nome</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
            minLength={2}
            autoFocus
          />
        </label>

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.test"
            required
          />
        </label>

        <label className="auth-field">
          <span>Senha</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mínimo 6 caracteres"
            required
            minLength={6}
          />
          <div className="strength-meter">
            <div className="strength-meter-track">
              {STRENGTH_LEVELS.map((lvl, i) => (
                <span
                  key={i}
                  className="strength-meter-segment"
                  style={{
                    background: i <= strengthIdx ? lvl.color : 'rgba(255,255,255,0.08)',
                  }}
                />
              ))}
            </div>
            <span
              className="strength-meter-label"
              style={{ color: strengthIdx >= 0 ? STRENGTH_LEVELS[strengthIdx].color : '#6B7280' }}
            >
              {strengthIdx >= 0 ? STRENGTH_LEVELS[strengthIdx].label : 'Digite uma senha'}
            </span>
          </div>
        </label>

        <label className="auth-field">
          <span>Repetir senha</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="digite a senha novamente"
            required
            minLength={6}
            aria-invalid={passwordsMismatch}
          />
          {passwordsMismatch && (
            <span className="field-hint" style={{ color: '#EF4444' }}>
              As senhas não coincidem
            </span>
          )}
          {passwordsMatch && (
            <span className="field-hint" style={{ color: '#34D399' }}>
              Senhas conferem
            </span>
          )}
        </label>

        <div className="auth-field">
          <span>Escolha seu avatar</span>
          <AvatarPicker value={avatarKey} onChange={setAvatarKey} />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button
          type="submit"
          className="auth-submit"
          disabled={submitting || !passwordsMatch}
        >
          {submitting ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <div className="auth-divider"><span>ou</span></div>

      <button type="button" className="auth-secondary" onClick={onSwitchToLogin}>
        Já tenho conta
      </button>
    </div>
  );
};

export default Register;
