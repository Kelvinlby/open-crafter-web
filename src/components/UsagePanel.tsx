import type { UsageInfo } from '../types';
import './UsagePanel.css';

export function UsagePanel({ label, value, detail }: UsageInfo) {
  return (
    <div className="usage-panel">
      <div className="usage-header">
        <span className="usage-label">{label}</span>
        <span className="usage-value">{Math.round(value)}%</span>
      </div>
      <div className="usage-bar">
        <div
          className="usage-bar-fill"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="usage-detail">{detail}</span>
    </div>
  );
}
