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

export interface ModelPageData {
  modelPath: string;
  selectedModel: string;
  availableModels: string[];
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
  adminRoleId: string;
  channelIds: string[];
}
