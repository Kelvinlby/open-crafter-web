import 'material-symbols/rounded.css';
import type { TabId } from '../types';
import './NavRail.css';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'model', label: 'Model', icon: 'token' },
  { id: 'runtime', label: 'Runtime', icon: 'dns' },
  { id: 'skill', label: 'Skill', icon: 'view_timeline' },
  { id: 'tool', label: 'Tool', icon: 'build' },
  { id: 'discord', label: 'Discord', icon: 'chat' },
];

interface NavRailProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function NavRail({ activeTab, onTabChange }: NavRailProps) {
  return (
    <nav className="nav-rail">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-rail-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          title={tab.label}
        >
          <span className="nav-rail-icon material-symbols-rounded">{tab.icon}</span>
          <span className="nav-rail-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
