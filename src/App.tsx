import { useState } from 'react';
import type { TabId } from './types';
import { useMockData } from './hooks/useMockData';
import { NavRail } from './components/NavRail';
import { ModelPage } from './pages/ModelPage';
import { RuntimePage } from './pages/RuntimePage';
import { SkillToolPage } from './pages/SkillToolPage';
import { DiscordPage } from './pages/DiscordPage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('model');
  const data = useMockData();

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
            <RuntimePage data={data.runtime.data} />
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
          {activeTab === 'discord' && (
            <DiscordPage
              data={data.discord.data}
              onBotTokenChange={data.discord.setBotToken}
              onAdminRoleIdChange={data.discord.setAdminRoleId}
              onAddChannelId={data.discord.addChannelId}
              onRemoveChannelId={data.discord.removeChannelId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
