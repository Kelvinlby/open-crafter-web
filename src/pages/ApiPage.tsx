import { useState } from 'react';
import type { ApiPageData } from '../types';
import { TextField } from '../components/TextField';
import { IconButton } from '../components/IconButton';
import './ApiPage.css';

interface ApiPageProps {
  data: ApiPageData;
  onIpRangeChange: (value: string) => void;
  onPortChange: (value: string) => void;
  onAddApiKey: (name: string, key: string) => void;
  onRemoveApiKey: (index: number) => void;
}

function generateApiKey(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function ApiPage({ data, onIpRangeChange, onPortChange, onAddApiKey, onRemoveApiKey }: ApiPageProps) {
  const [draftKeyName, setDraftKeyName] = useState('');

  const handleGenerate = () => {
    const trimmed = draftKeyName.trim();
    if (!trimmed) return;
    onAddApiKey(trimmed, generateApiKey());
    setDraftKeyName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGenerate();
  };

  return (
    <div className="api-page">
      <TextField label="Accepted IP Range" value={data.acceptedIpRange} onChange={onIpRangeChange} />
      <TextField label="Port" value={data.port} onChange={onPortChange} />

      <div className="api-key-list">
        <span className="api-key-list-label">API Keys</span>
        <div className="api-key-items">
          {data.apiKeys.map((item, i) => (
            <div key={item.name} className="api-key-item">
              <span className="api-key-name">{item.name}</span>
              <span className="api-key-value">{item.key}</span>
              <IconButton onClick={() => onRemoveApiKey(i)} title="Remove">&#x2715;</IconButton>
            </div>
          ))}
        </div>
        <div className="api-key-add">
          <input
            className="api-key-input"
            value={draftKeyName}
            onChange={e => setDraftKeyName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Key name..."
          />
          <button className="api-key-generate-btn" onClick={handleGenerate}>Generate</button>
        </div>
      </div>
    </div>
  );
}
