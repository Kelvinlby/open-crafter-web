import { useState } from 'react';
import type { ModelPageData, RuntimePageData, SkillToolItem, ApiPageData } from '../types';

export function useMockData() {
  // Model
  const [modelData, setModelData] = useState<ModelPageData>({
    modelPath: '/models/llama-3-8b-instruct',
    selectedModel: '/models/llama-3-8b-instruct',
    availableModels: [
      { folder: '/models/llama-3-8b-instruct', name: 'Llama 3 8B Instruct' },
      { folder: '/models/llama-3-70b', name: 'Llama 3 70B' },
      { folder: '/models/mistral-7b-v0.3', name: 'Mistral 7B v0.3' },
      { folder: '/models/qwen2-7b', name: 'Qwen2 7B' },
      { folder: '/models/phi-3-mini', name: 'Phi 3 Mini' },
    ],
    hyperparams: [
      { id: 'temperature', title: 'Temperature', value: 0.7, min: 0, max: 2, step: 0.05, defaultValue: 0.7 },
      { id: 'top_p', title: 'Top P', value: 0.9, min: 0, max: 1, step: 0.01, defaultValue: 0.9 },
      { id: 'top_k', title: 'Top K', value: 40, min: 1, max: 100, step: 1, defaultValue: 40 },
      { id: 'max_tokens', title: 'Max Tokens', value: 2048, min: 64, max: 8192, step: 64, defaultValue: 2048 },
      { id: 'repeat_penalty', title: 'Repeat Penalty', value: 1.1, min: 1, max: 2, step: 0.05, defaultValue: 1.1 },
    ],
  });

  // Runtime
  const [runtimeData] = useState<RuntimePageData>({
    ram: { label: 'RAM', value: 52, detail: '8.3 / 16.0 GB' },
    vram: { label: 'VRAM', value: 71, detail: '5.7 / 8.0 GB' },
    gpu: { label: 'GPU', value: 45, detail: '45% utilization' },
    selectedDevice: 'CUDA:0 (RTX 3070)',
    availableDevices: ['CUDA:0 (RTX 3070)', 'CUDA:1 (RTX 3060)', 'CPU'],
  });

  // Skills
  const [skillItems] = useState<SkillToolItem[]>([
    { id: 'pathfinding', title: 'Pathfinding', version: '1.2.0', description: 'A* pathfinding with dynamic obstacle avoidance. Supports 3D navigation mesh traversal for complex terrain including water, lava, and scaffolding. Includes jump-sprint optimization and elytra flight paths.' },
    { id: 'building', title: 'Building', version: '0.8.1', description: 'Schematic-based building with automatic material gathering. Supports NBT structure files and litematica schematics. Includes scaffolding placement and block-by-block verification.' },
    { id: 'combat', title: 'Combat', version: '1.0.3', description: 'PvE combat with mob targeting, shield blocking, and bow aiming. Supports critical hits, sweep attacks, and potion usage. Includes flee behavior when health is low.' },
    { id: 'farming', title: 'Farming', version: '1.1.0', description: 'Automated crop farming with replanting. Supports wheat, carrots, potatoes, beetroot, and nether wart. Includes bone meal optimization and harvest timing.' },
    { id: 'mining', title: 'Mining', version: '2.0.0', description: 'Strip mining and branch mining with ore detection. Supports fortune and silk touch tool selection. Includes torch placement and lava/water hazard avoidance.' },
  ]);
  const [selectedSkillId, setSelectedSkillId] = useState('pathfinding');

  // Tools
  const [toolItems] = useState<SkillToolItem[]>([
    { id: 'chat', title: 'Chat', version: '1.0.0', description: 'Send and receive in-game chat messages. Supports whisper, party, and global channels. Includes message formatting and command execution.' },
    { id: 'inventory', title: 'Inventory', version: '1.3.2', description: 'Inspect and manage player inventory. Supports item sorting, crafting recipe lookup, and container interaction (chests, furnaces, brewing stands).' },
    { id: 'world', title: 'World Info', version: '1.1.0', description: 'Query world state including time, weather, biome, and nearby entities. Supports block scanning in a configurable radius and structure detection.' },
    { id: 'movement', title: 'Movement', version: '0.9.5', description: 'Low-level movement commands: walk, sprint, jump, sneak, swim. Supports coordinate-based movement and relative direction commands.' },
  ]);
  const [selectedToolId, setSelectedToolId] = useState('chat');

  // API Config
  const [apiData, setApiData] = useState<ApiPageData>({
    acceptedIpRange: '0.0.0.0/0',
    port: '8080',
    apiKeys: [{ name: 'dev-key', key: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' }],
  });

  return {
    loading: false,
    error: false,
    model: {
      data: modelData,
      setModelPath: (path: string) =>
        setModelData((d) => ({ ...d, modelPath: path })),
      setSelectedModel: (model: string) =>
        setModelData((d) => ({ ...d, selectedModel: model })),
      updateHyperparam: (id: string, value: number) =>
        setModelData((d) => ({
          ...d,
          hyperparams: d.hyperparams.map((h) => (h.id === id ? { ...h, value } : h)),
        })),
      resetHyperparam: (id: string) =>
        setModelData((d) => ({
          ...d,
          hyperparams: d.hyperparams.map((h) => (h.id === id ? { ...h, value: h.defaultValue } : h)),
        })),
    },
    runtime: { data: runtimeData },
    skills: { items: skillItems, selectedId: selectedSkillId, setSelectedId: setSelectedSkillId },
    tools: { items: toolItems, selectedId: selectedToolId, setSelectedId: setSelectedToolId },
    api: {
      data: apiData,
      setIpRange: (value: string) => setApiData(d => ({ ...d, acceptedIpRange: value })),
      setPort: (value: string) => setApiData(d => ({ ...d, port: value })),
      addApiKey: (name: string, key: string) => setApiData(d => ({ ...d, apiKeys: [...d.apiKeys, { name, key }] })),
      removeApiKey: (index: number) => setApiData(d => ({ ...d, apiKeys: d.apiKeys.filter((_, i) => i !== index) })),
    },
  };
}
