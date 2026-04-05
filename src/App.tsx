import { useState, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import type { TabId, ModelStatus } from './types';
import { useBackendData } from './hooks/useBackendData';
import { useModelStatus } from './hooks/useModelStatus';
import { NavRail } from './components/NavRail';
import { ModelFab } from './components/ModelFab';
import { Snackbar } from './components/Snackbar';
import { ModelPage } from './pages/ModelPage';
import { RuntimePage } from './pages/RuntimePage';
import { SkillToolPage } from './pages/SkillToolPage';
import { ApiPage } from './pages/ApiPage';
import { ChatPage } from './pages/ChatPage';
import './App.css';

interface FabProps {
  modelStatus: ModelStatus;
  onFabClick: () => void;
}

function HomePage({ modelStatus, onFabClick }: FabProps) {
  const [activeTab, setActiveTab] = useState<TabId>('model');
  const data = useBackendData(activeTab);
  const fabRef = useRef<HTMLButtonElement>(null);

  if (data.loading || data.error) {
    return (
      <div className="backdrop">
        <div className="plate" style={data.error ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : undefined}>
          {data.error && <span style={{ color: 'var(--md-sys-color-error)', fontSize: '0.875rem' }}>Unable to connect to backend.</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop">
      <div className="plate-anchor">
        <div className="plate">
          <NavRail activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="plate-content" key={activeTab}>
            {activeTab === 'model' && (
              <ModelPage
                data={data.model.data}
                onModelPathChange={data.model.setModelPath}
                onModelSelect={(model) => { data.model.setSelectedModel(model); fabRef.current?.focus(); }}
                onHyperparamChange={data.model.updateHyperparam}
                onHyperparamReset={data.model.resetHyperparam}
              />
            )}
            {activeTab === 'runtime' && data.runtime.data && (
              <RuntimePage data={data.runtime.data} onDeviceChange={data.runtime.setSelectedDevice} />
            )}
            {activeTab === 'skill' && (
              <SkillToolPage
                items={data.skills.items}
                selectedId={data.skills.selectedId}
                onSelect={data.skills.setSelectedId}
                onToggle={data.skills.toggle}
              />
            )}
            {activeTab === 'tool' && (
              <SkillToolPage
                items={data.tools.items}
                selectedId={data.tools.selectedId}
                onSelect={data.tools.setSelectedId}
                onToggle={data.tools.toggle}
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
        <ModelFab ref={fabRef} status={modelStatus} onClick={onFabClick} />
      </div>
    </div>
  );
}

function App() {
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const { modelStatus, handleFabClick } = useModelStatus(setSnackbarMessage);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage modelStatus={modelStatus} onFabClick={handleFabClick} />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Snackbar message={snackbarMessage} onDismiss={() => setSnackbarMessage(null)} />
    </>
  );
}

export default App;
