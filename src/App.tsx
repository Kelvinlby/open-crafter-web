import { useState } from 'react';
import type { TabId } from './types';
import { useBackendData } from './hooks/useBackendData';
import { NavRail } from './components/NavRail';
import { ModelPage } from './pages/ModelPage';
import { RuntimePage } from './pages/RuntimePage';
import { SkillToolPage } from './pages/SkillToolPage';
import { ApiPage } from './pages/ApiPage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('model');
  const data = useBackendData();


  if (data.loading) {
    return (
      <div className="backdrop">
        <div className="plate" />
      </div>
    );
  }

  return (
    <div className="backdrop">
      <div className="plate">
        <NavRail activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="plate-content" key={activeTab}>
          {activeTab === 'model' && (
            <ModelPage
              data={data.model.data}
              onModelPathChange={data.model.setModelPath}
              onModelSelect={data.model.setSelectedModel}
              onHyperparamChange={data.model.updateHyperparam}
              onHyperparamReset={data.model.resetHyperparam}
            />
          )}
          {activeTab === 'runtime' && (
            <RuntimePage data={data.runtime.data} onDeviceChange={data.runtime.setSelectedDevice} />
          )}
          {activeTab === 'skill' && (
            <SkillToolPage
              items={data.skills.items}
              selectedId={data.skills.selectedId}
              onSelect={data.skills.setSelectedId}
            />
          )}
          {activeTab === 'tool' && (
            <SkillToolPage
              items={data.tools.items}
              selectedId={data.tools.selectedId}
              onSelect={data.tools.setSelectedId}
            />
          )}
          {activeTab === 'api' && (
            <ApiPage
              data={data.api.data}
              onIpRangeChange={data.api.setIpRange}
              onPortChange={data.api.setPort}
              onAddApiKey={data.api.addApiKey}
              onRemoveApiKey={data.api.removeApiKey}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
