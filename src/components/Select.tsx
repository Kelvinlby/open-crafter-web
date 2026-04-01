import { useId } from 'react';
import './Select.css';

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function Select({ label, value, options, onChange }: SelectProps) {
  const id = useId();

  return (
    <div className="select-field">
      <select
        id={id}
        className="select-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <label htmlFor={id} className="select-label">{label}</label>
      <div className="select-arrow">&#x25BC;</div>
    </div>
  );
}
