import { useState } from 'react';
import { IconButton } from './IconButton';
import './AddableList.css';

interface AddableListProps {
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}

export function AddableList({ label, items, onAdd, onRemove }: AddableListProps) {
  const [draft, setDraft] = useState('');

  const handleAdd = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      onAdd(trimmed);
      setDraft('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="addable-list">
      <span className="addable-list-label">{label}</span>
      <div className="addable-list-items">
        {items.map((item, i) => (
          <div key={i} className="addable-list-item">
            <span className="addable-list-item-text">{item}</span>
            <IconButton onClick={() => onRemove(i)} title="Remove">&#x2715;</IconButton>
          </div>
        ))}
      </div>
      <div className="addable-list-add">
        <input
          className="addable-list-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add new..."
        />
        <IconButton onClick={handleAdd} title="Add">&#x2B;</IconButton>
      </div>
    </div>
  );
}
