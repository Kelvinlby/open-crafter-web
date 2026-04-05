import './Switch.css';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ checked, onChange }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={`md-switch ${checked ? 'md-switch--on' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
    >
      <span className="md-switch-thumb" />
    </button>
  );
}
