export type TabId = 'model' | 'runtime' | 'skill' | 'tool' | 'discord';

export interface HyperparamConfig {
  id: string;
  title: string;
  value: number;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface ModelOption {
  folder: string;
  name: string;
}

export interface ModelPageData {
  modelPath: string;
  selectedModel: string;
  availableModels: ModelOption[];
  hyperparams: HyperparamConfig[];
}

export interface UsageInfo {
  label: string;
  value: number;
  detail: string;
}

export interface RuntimePageData {
  ram: UsageInfo;
  vram: UsageInfo;
  gpu: UsageInfo;
  selectedDevice: string;
  availableDevices: string[];
}

export interface SkillToolItem {
  id: string;
  title: string;
  version: string;
  description: string;
}

export interface DiscordPageData {
  botToken: string;
  adminChannelId: string;
  logChannelId: string;
  userChannelIds: string[];
}
