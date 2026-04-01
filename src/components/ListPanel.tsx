import type { SkillToolItem } from '../types';
import { Divider } from './Divider';
import './ListPanel.css';

interface ListPanelProps {
  items: SkillToolItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ListPanel({ items, selectedId, onSelect }: ListPanelProps) {
  const selected = items.find((i) => i.id === selectedId);

  return (
    <div className="list-panel">
      <div className="list-panel-list">
        {items.map((item) => (
          <button
            key={item.id}
            className={`list-panel-item ${item.id === selectedId ? 'active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <span className="list-panel-title">{item.title}</span>
            <span className="list-panel-version">{item.version}</span>
          </button>
        ))}
      </div>
      <Divider vertical />
      <div className="list-panel-content">
        {selected ? (
          <p>{selected.description}</p>
        ) : (
          <p className="list-panel-empty">Select an item</p>
        )}
      </div>
    </div>
  );
}
