import type { SkillToolItem } from '../types';
import { ListPanel } from '../components/ListPanel';
import './SkillToolPage.css';

interface SkillToolPageProps {
  items: SkillToolItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onToggle?: (id: string, enabled: boolean) => void;
}

export function SkillToolPage({ items, selectedId, onSelect, onToggle }: SkillToolPageProps) {
  return (
    <div className="skill-tool-page">
      <ListPanel items={items} selectedId={selectedId} onSelect={onSelect} onToggle={onToggle} />
    </div>
  );
}
