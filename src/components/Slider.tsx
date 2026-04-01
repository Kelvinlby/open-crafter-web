import './Slider.css';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function Slider({ value, min, max, step, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <input
      className="md-slider"
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ '--slider-pct': `${pct}%` } as React.CSSProperties}
    />
  );
}
