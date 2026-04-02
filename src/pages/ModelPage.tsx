import type { ModelPageData } from '../types';
import { TextField } from '../components/TextField';
import { Select } from '../components/Select';
import { Slider } from '../components/Slider';
import { IconButton } from '../components/IconButton';
import { Divider } from '../components/Divider';
import './ModelPage.css';

interface ModelPageProps {
  data: ModelPageData;
  onModelPathChange: (path: string) => void;
  onModelSelect: (model: string) => void;
  onHyperparamChange: (id: string, value: number) => void;
  onHyperparamReset: (id: string) => void;
}

export function ModelPage({
  data,
  onModelPathChange,
  onModelSelect,
  onHyperparamChange,
  onHyperparamReset,
}: ModelPageProps) {
  return (
    <div className="model-page">
      <TextField label="Model Path" value={data.modelPath} onChange={onModelPathChange} />
      <Select
        label="Model"
        value={data.selectedModel}
        options={data.availableModels.map((m) => ({ value: m.folder, label: m.name }))}
        onChange={onModelSelect}
      />
      <Divider />
      <div className="hyperparam-list">
        {data.hyperparams.map((hp) => (
          <div key={hp.id} className="hyperparam-row">
            <span className="hyperparam-title">{hp.title}</span>
            <input
              className="hyperparam-value"
              type="number"
              value={hp.value}
              min={hp.min}
              max={hp.max}
              step={hp.step}
              onChange={(e) => onHyperparamChange(hp.id, Number(e.target.value))}
            />
            <Slider
              value={hp.value}
              min={hp.min}
              max={hp.max}
              step={hp.step}
              onChange={(v) => onHyperparamChange(hp.id, v)}
            />
            <IconButton onClick={() => onHyperparamReset(hp.id)} title="Reset to default">
              &#x21BA;
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}
