import type { SkillToolItem } from '../types';
import { ListPanel } from '../components/ListPanel';
import './SkillToolPage.css';

interface SkillToolPageProps {
  items: SkillToolItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function SkillToolPage({ items, selectedId, onSelect }: SkillToolPageProps) {
  return (
    <div className="skill-tool-page">
      <ListPanel items={items} selectedId={selectedId} onSelect={onSelect} />
    </div>
  );
}
