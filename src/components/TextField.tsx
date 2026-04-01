import { useId } from 'react';
import './TextField.css';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export function TextField({ label, value, onChange, type = 'text' }: TextFieldProps) {
  const id = useId();

  return (
    <div className="text-field">
      <input
        id={id}
        className="text-field-input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
      />
      <label htmlFor={id} className="text-field-label">{label}</label>
      <div className="text-field-outline" />
    </div>
  );
}
