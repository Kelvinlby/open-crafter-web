import type { RuntimePageData } from '../types';
import { UsagePanel } from '../components/UsagePanel';
import { Select } from '../components/Select';
import './RuntimePage.css';

interface RuntimePageProps {
  data: RuntimePageData;
  onDeviceChange?: (device: string) => void;
}

export function RuntimePage({ data, onDeviceChange }: RuntimePageProps) {
  const handleDeviceChange = (device: string) => {
    onDeviceChange?.(device);
  };

  return (
    <div className="runtime-page">
      <div className="usage-row">
        <UsagePanel {...data.ram} />
        <UsagePanel {...data.vram} />
        <UsagePanel {...data.gpu} />
      </div>
      <Select
        label="Inference Device"
        value={data.selectedDevice}
        options={data.availableDevices.map((d) => ({ value: d, label: d }))}
        onChange={handleDeviceChange}
      />
    </div>
  );
}
