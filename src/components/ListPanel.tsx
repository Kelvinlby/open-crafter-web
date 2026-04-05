import type { SkillToolItem } from '../types';
import { Divider } from './Divider';
import './ListPanel.css';

interface ListPanelProps {
  items: SkillToolItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onToggle?: (id: string, enabled: boolean) => void;
}

export function ListPanel({ items, selectedId, onSelect, onToggle }: ListPanelProps) {
  const selected = items.find((i) => i.id === selectedId);

  return (
    <div className="list-panel">
      <div className="list-panel-list">
        {items.length === 0 ? (
          <p className="list-panel-empty">No items found</p>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              className={`list-panel-item ${item.id === selectedId ? 'active' : ''} ${!item.enabled ? 'disabled' : ''}`}
              onClick={() => onSelect(item.id)}
            >
              {onToggle && (
                <button
                  role="checkbox"
                  aria-checked={item.enabled}
                  className={`list-panel-checkbox ${item.enabled ? 'list-panel-checkbox--checked' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onToggle(item.id, !item.enabled); }}
                >
                  <svg className="list-panel-checkbox-mark" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 9L7 12.5L14.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              <span className="list-panel-title">{item.title}</span>
              <span className="list-panel-version">{item.version}</span>
            </button>
          ))
        )}
      </div>
      <Divider vertical />
      <div className="list-panel-content">
        {items.length > 0 && (
          selected ? (
            <p>{selected.description}</p>
          ) : (
            <p className="list-panel-empty">Select an item</p>
          )
        )}
      </div>
    </div>
  );
}
