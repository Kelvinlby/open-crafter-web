import { useState, useEffect } from 'react';
import type { ModelPageData, RuntimePageData, SkillToolItem, DiscordPageData } from '../types';

export function useBackendData() {
  const [modelData, setModelData] = useState<ModelPageData | null>(null);
  const [runtimeData, setRuntimeData] = useState<RuntimePageData | null>(null);
  const [skillItems, setSkillItems] = useState<SkillToolItem[] | null>(null);
  const [toolItems, setToolItems] = useState<SkillToolItem[] | null>(null);
  const [discordData, setDiscordData] = useState<DiscordPageData | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedToolId, setSelectedToolId] = useState('');

  // One-time fetches for static data
  useEffect(() => {
    fetch('/api/model')
      .then(r => r.json())
      .then(setModelData)
      .catch(err => console.error('Failed to fetch model data:', err));

    fetch('/api/skills')
      .then(r => r.json())
      .then((items) => {
        setSkillItems(items);
        if (items.length > 0) setSelectedSkillId(items[0].id);
      })
      .catch(err => console.error('Failed to fetch skills:', err));

    fetch('/api/tools')
      .then(r => r.json())
      .then((items) => {
        setToolItems(items);
        if (items.length > 0) setSelectedToolId(items[0].id);
      })
      .catch(err => console.error('Failed to fetch tools:', err));

    fetch('/api/discord')
      .then(r => r.json())
      .then(setDiscordData)
      .catch(err => console.error('Failed to fetch discord data:', err));
  }, []);

  // Polling for runtime data every 500ms
  useEffect(() => {
    const fetchRuntime = () =>
      fetch('/api/runtime')
        .then(r => r.json())
        .then(setRuntimeData)
        .catch(err => console.error('Failed to fetch runtime data:', err));

    fetchRuntime(); // initial fetch
    const interval = setInterval(fetchRuntime, 500);
    return () => clearInterval(interval);
  }, []);

  // Loading state
  const loading = !modelData || !runtimeData || !skillItems || !toolItems || !discordData;

  // Return the same shape as useMockData
  return {
    loading,
    model: {
      data: modelData!,
      setModelPath: (path: string) =>
        setModelData(d => d ? { ...d, modelPath: path } : d),
      setSelectedModel: (model: string) =>
        setModelData(d => d ? { ...d, selectedModel: model } : d),
      updateHyperparam: (id: string, value: number) =>
        setModelData(d => d ? {
          ...d,
          hyperparams: d.hyperparams.map(h => h.id === id ? { ...h, value } : h),
        } : d),
      resetHyperparam: (id: string) =>
        setModelData(d => d ? {
          ...d,
          hyperparams: d.hyperparams.map(h => h.id === id ? { ...h, value: h.defaultValue } : h),
        } : d),
    },
    runtime: { data: runtimeData! },
    skills: { items: skillItems!, selectedId: selectedSkillId, setSelectedId: setSelectedSkillId },
    tools: { items: toolItems!, selectedId: selectedToolId, setSelectedId: setSelectedToolId },
    discord: {
      data: discordData!,
      setBotToken: (token: string) =>
        setDiscordData(d => d ? { ...d, botToken: token } : d),
      setAdminRoleId: (id: string) =>
        setDiscordData(d => d ? { ...d, adminRoleId: id } : d),
      addChannelId: (id: string) =>
        setDiscordData(d => d ? { ...d, channelIds: [...d.channelIds, id] } : d),
      removeChannelId: (index: number) =>
        setDiscordData(d => d ? { ...d, channelIds: d.channelIds.filter((_, i) => i !== index) } : d),
    },
  };
}
