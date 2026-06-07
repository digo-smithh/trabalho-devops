import React from 'react';
import '../styles/avatar.css';

export const AVATARS = [
  { key: 'coral',   label: 'Coral',     color1: '#FF6B6B', color2: '#FF4D4D', icon: 'note' },
  { key: 'violet',  label: 'Violeta',   color1: '#A78BFA', color2: '#7C5CE0', icon: 'headphones' },
  { key: 'emerald', label: 'Esmeralda', color1: '#34D399', color2: '#10B981', icon: 'mic' },
  { key: 'amber',   label: 'Âmbar',     color1: '#FBBF24', color2: '#F59E0B', icon: 'guitar' },
  { key: 'azure',   label: 'Azul',      color1: '#60A5FA', color2: '#2563EB', icon: 'piano' },
  { key: 'rose',    label: 'Rosa',      color1: '#F472B6', color2: '#DB2777', icon: 'vinyl' },
];

const ICON_PATHS = {
  note: (
    <g fill="white">
      <path d="M19 4v9.5a3.5 3.5 0 1 1-2-3.163V6.6L11 8v8.5a3.5 3.5 0 1 1-2-3.163V5.6L19 4z"/>
    </g>
  ),
  headphones: (
    <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14a9 9 0 0 1 18 0"/>
      <path d="M3 14v3a2 2 0 0 0 2 2h2v-7H5a2 2 0 0 0-2 2z"/>
      <path d="M21 14v3a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2z"/>
    </g>
  ),
  mic: (
    <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="11" rx="3"/>
      <path d="M5 11a7 7 0 0 0 14 0"/>
      <path d="M12 18v3"/>
      <path d="M9 21h6"/>
    </g>
  ),
  guitar: (
    <g fill="white">
      <path d="M19.5 3.2a1 1 0 0 0-1.4 0l-1.7 1.7-1.4-1.4-1.4 1.4 1.4 1.4-1.6 1.6-1.4-1.4-1.4 1.4 1.4 1.4-2 2A4 4 0 1 0 13 14.5l2-2 1.4 1.4 1.4-1.4-1.4-1.4 1.6-1.6 1.4 1.4 1.4-1.4-1.4-1.4 1.7-1.7a1 1 0 0 0 0-1.4l-1.6-1.6zM9 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
    </g>
  ),
  piano: (
    <g fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round">
      <rect x="4" y="6" width="16" height="12" rx="1.5" fill="rgba(255,255,255,0.15)"/>
      <line x1="9" y1="6" x2="9" y2="14"/>
      <line x1="12" y1="6" x2="12" y2="14"/>
      <line x1="15" y1="6" x2="15" y2="14"/>
      <rect x="7.7" y="6" width="2" height="6" fill="white" stroke="none"/>
      <rect x="10.7" y="6" width="2" height="6" fill="white" stroke="none"/>
      <rect x="13.7" y="6" width="2" height="6" fill="white" stroke="none"/>
    </g>
  ),
  vinyl: (
    <g>
      <circle cx="12" cy="12" r="9" fill="rgba(0,0,0,0.35)"/>
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6"/>
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6"/>
      <circle cx="12" cy="12" r="2.5" fill="white"/>
      <circle cx="12" cy="12" r="0.7" fill="rgba(0,0,0,0.6)"/>
    </g>
  ),
};

export const Avatar = ({ avatarKey, size = 64, ring = false }) => {
  const a = AVATARS.find(x => x.key === avatarKey) || AVATARS[0];
  const gradId = `grad-${a.key}`;
  return (
    <div
      className={`avatar-wrap${ring ? ' avatar-ring' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={a.color1}/>
            <stop offset="100%" stopColor={a.color2}/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="12" fill={`url(#${gradId})`}/>
        {ICON_PATHS[a.icon]}
      </svg>
    </div>
  );
};

export const AvatarPicker = ({ value, onChange }) => (
  <div className="avatar-picker">
    {AVATARS.map(a => (
      <button
        type="button"
        key={a.key}
        className={`avatar-option${value === a.key ? ' selected' : ''}`}
        onClick={() => onChange(a.key)}
        title={a.label}
      >
        <Avatar avatarKey={a.key} size={56} />
      </button>
    ))}
  </div>
);
