import type { RuntimePageData } from '../types';
import { UsagePanel } from '../components/UsagePanel';
import { Select } from '../components/Select';
import './RuntimePage.css';

interface RuntimePageProps {
  data: RuntimePageData;
}

export function RuntimePage({ data }: RuntimePageProps) {
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
        options={data.availableDevices}
        onChange={() => {}}
      />
    </div>
  );
}
