import { useState, useEffect, useCallback, useRef } from 'react';
import type { ModelPageData, ModelOption, RuntimePageData, SkillToolItem, ApiPageData } from '../types';

async function postJson(url: string, body: unknown): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.error(`POST ${url} failed with status ${response.status}: ${response.statusText}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Failed to POST ${url}:`, err);
    return false;
  }
}

export function useBackendData() {
  const [modelData, setModelData] = useState<ModelPageData | null>(null);
  const [runtimeData, setRuntimeData] = useState<RuntimePageData | null>(null);
  const [skillItems, setSkillItems] = useState<SkillToolItem[] | null>(null);
  const [toolItems, setToolItems] = useState<SkillToolItem[] | null>(null);
  const [apiData, setApiData] = useState<ApiPageData | null>(null);
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

    fetch('/api/config')
      .then(r => r.json())
      .then(setApiData)
      .catch(err => console.error('Failed to fetch api config:', err));
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

  // Refetch model data from backend to get updated hyperparams
  const reloadModelData = useCallback(async () => {
    try {
      const response = await fetch('/api/model');
      if (!response.ok) {
        throw new Error(`Failed to fetch model data: ${response.statusText}`);
      }
      const data = await response.json() as ModelPageData;
      setModelData(data);
    } catch (err) {
      console.error('Failed to reload model data:', err);
    }
  }, []);

  // Scan models when model path changes
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scanModels = useCallback((path: string) => {
    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
    }
    scanTimerRef.current = setTimeout(() => {
      fetch('/api/model/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelPath: path }),
      })
        .then(r => r.json())
        .then(async (models: ModelOption[]) => {
          const selectedModel = models.length > 0 ? models[0].folder : '';
          setModelData(d => d ? {
            ...d,
            availableModels: models,
            selectedModel,
          } : d);
          // Persist model path + auto-selected model
          await postJson('/api/model/save', { modelPath: path, selectedModel });
          // Reload model data to get hyperparams for the auto-selected model
          await reloadModelData();
        })
        .catch(err => console.error('Failed to scan models:', err));
    }, 300);
  }, []);

  // Debounced save for api config (ip range + port only)
  const apiSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveApiConfig = useCallback((data: Pick<ApiPageData, 'acceptedIpRange' | 'port'>) => {
    if (apiSaveRef.current) clearTimeout(apiSaveRef.current);
    apiSaveRef.current = setTimeout(() => {
      postJson('/api/config/save', data);
    }, 300);
  }, []);

  // Loading state
  const loading = !modelData || !runtimeData || !skillItems || !toolItems || !apiData;

  // Return the same shape as useMockData
  return {
    loading,
    model: {
      data: modelData!,
      setModelPath: (path: string) => {
        setModelData(d => d ? { ...d, modelPath: path } : d);
        scanModels(path);
      },
      setSelectedModel: async (model: string) => {
        setModelData(d => {
          if (!d) return d;
          // Persist selection with current modelPath
          postJson('/api/model/save', { modelPath: d.modelPath, selectedModel: model });
          return { ...d, selectedModel: model };
        });
        // Reload model data to get updated hyperparams for the selected model
        await reloadModelData();
      },
      updateHyperparam: (id: string, value: number) => {
        setModelData(d => {
          if (!d) return d;
          // Persist hyperparameter change
          postJson('/api/model/hyperparam', { paramId: id, value });
          return {
            ...d,
            hyperparams: d.hyperparams.map(h => h.id === id ? { ...h, value } : h),
          };
        });
      },
      resetHyperparam: (id: string) => {
        setModelData(d => {
          if (!d) return d;
          const param = d.hyperparams.find(h => h.id === id);
          if (!param) return d;
          // Persist hyperparameter reset
          postJson('/api/model/hyperparam', { paramId: id, value: param.defaultValue });
          return {
            ...d,
            hyperparams: d.hyperparams.map(h => h.id === id ? { ...h, value: h.defaultValue } : h),
          };
        });
      },
    },
    runtime: {
      data: runtimeData!,
      setSelectedDevice: (device: string) => {
        setRuntimeData(d => {
          if (!d) return d;
          // Persist device selection
          postJson('/api/runtime/save', { inferenceDevice: device });
          return { ...d, selectedDevice: device };
        });
      },
    },
    skills: { items: skillItems!, selectedId: selectedSkillId, setSelectedId: setSelectedSkillId },
    tools: { items: toolItems!, selectedId: selectedToolId, setSelectedId: setSelectedToolId },
    api: {
      data: apiData!,
      setIpRange: (value: string) => {
        setApiData(d => {
          if (!d) return d;
          const updated = { ...d, acceptedIpRange: value };
          saveApiConfig({ acceptedIpRange: value, port: d.port });
          return updated;
        });
      },
      setPort: (value: string) => {
        setApiData(d => {
          if (!d) return d;
          saveApiConfig({ acceptedIpRange: d.acceptedIpRange, port: value });
          return { ...d, port: value };
        });
      },
      addApiKey: (name: string, key: string) => {
        setApiData(d => {
          if (!d) return d;
          const updated = { ...d, apiKeys: [...d.apiKeys, { name, key }] };
          postJson('/api/config/api-key', { name, key });
          return updated;
        });
      },
      removeApiKey: (index: number) => {
        setApiData(d => {
          if (!d) return d;
          fetch(`/api/config/api-key/${index}`, { method: 'DELETE' })
            .catch(err => console.error('Failed to delete api key:', err));
          return { ...d, apiKeys: d.apiKeys.filter((_, i) => i !== index) };
        });
      },
    },
  };
}
