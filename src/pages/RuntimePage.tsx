import { useState, useEffect } from 'react';
import type { RuntimePageData } from '../types';
import { UsagePanel } from '../components/UsagePanel';
import { Select } from '../components/Select';
import './RuntimePage.css';

interface RuntimePageProps {
  data: RuntimePageData;
}

export function RuntimePage({ data }: RuntimePageProps) {
  const [selectedDevice, setSelectedDevice] = useState<string>(data.selectedDevice);

  useEffect(() => {
    setSelectedDevice(data.selectedDevice);
  }, [data.selectedDevice]);

  return (
    <div className="runtime-page">
      <div className="usage-row">
        <UsagePanel {...data.ram} />
        <UsagePanel {...data.vram} />
        <UsagePanel {...data.gpu} />
      </div>
      <Select
        label="Inference Device"
        value={selectedDevice}
        options={data.availableDevices}
        onChange={setSelectedDevice}
      />
    </div>
  );
}
