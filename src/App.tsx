import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import type { TabId } from './types';
import { useBackendData } from './hooks/useBackendData';
import { NavRail } from './components/NavRail';
import { ModelPage } from './pages/ModelPage';
import { RuntimePage } from './pages/RuntimePage';
import { SkillToolPage } from './pages/SkillToolPage';
import { ApiPage } from './pages/ApiPage';
import { ChatPage } from './pages/ChatPage';
import './App.css';

function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>('model');
  const data = useBackendData(activeTab);


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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
