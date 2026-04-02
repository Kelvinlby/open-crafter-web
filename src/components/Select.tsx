import { useId } from 'react';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
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
        onChange={(e) => {
          onChange(e.target.value);
          e.target.blur();
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label htmlFor={id} className="select-label">{label}</label>
    </div>
  );
}
