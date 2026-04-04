import { useState, useEffect, useCallback, useRef } from 'react';
import type { ModelPageData, ModelOption, RuntimePageData, SkillToolItem, ApiPageData } from '../types';
import { postJson, getJson, API, DEBOUNCE_MS, POLL_INTERVAL_MS } from '../api';

export function useBackendData(activeTab: string) {
  const [modelData, setModelData] = useState<ModelPageData | null>(null);
  const [runtimeData, setRuntimeData] = useState<RuntimePageData | null>(null);
  const [skillItems, setSkillItems] = useState<SkillToolItem[] | null>(null);
  const [toolItems, setToolItems] = useState<SkillToolItem[] | null>(null);
  const [apiData, setApiData] = useState<ApiPageData | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedToolId, setSelectedToolId] = useState('');
  const [fetchError, setFetchError] = useState(false);

  // One-time parallel fetch for all static data
  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      getJson<ModelPageData>(API.model),
      getJson<SkillToolItem[]>(API.skills),
      getJson<SkillToolItem[]>(API.tools),
      getJson<ApiPageData>(API.config),
    ]).then(([modelResult, skillsResult, toolsResult, apiResult]) => {
      if (cancelled) return;

      let hadError = false;

      if (modelResult.status === 'fulfilled') {
        setModelData(modelResult.value);
      } else {
        console.error('Failed to fetch model data:', modelResult.reason);
        hadError = true;
      }

      if (skillsResult.status === 'fulfilled') {
        const items = skillsResult.value;
        setSkillItems(items);
        if (items.length > 0) setSelectedSkillId(items[0].id);
      } else {
        console.error('Failed to fetch skills:', skillsResult.reason);
        hadError = true;
      }

      if (toolsResult.status === 'fulfilled') {
        const items = toolsResult.value;
        setToolItems(items);
        if (items.length > 0) setSelectedToolId(items[0].id);
      } else {
        console.error('Failed to fetch tools:', toolsResult.reason);
        hadError = true;
      }

      if (apiResult.status === 'fulfilled') {
        setApiData(apiResult.value);
      } else {
        console.error('Failed to fetch api config:', apiResult.reason);
        hadError = true;
      }

      if (hadError) setFetchError(true);
    });

    return () => { cancelled = true; };
  }, []);

  // Polling for runtime data every 500ms, only when runtime tab is active
  useEffect(() => {
    if (activeTab !== 'runtime') return;

    const fetchRuntime = () =>
      getJson<RuntimePageData>(API.runtime)
        .then(setRuntimeData)
        .catch(err => console.error('Failed to fetch runtime data:', err));

    fetchRuntime(); // initial fetch when switching to runtime tab
    const interval = setInterval(fetchRuntime, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Refetch model data from backend to get updated hyperparams
  const reloadModelData = useCallback(async () => {
    try {
      const data = await getJson<ModelPageData>(API.model);
      setModelData(data);
    } catch (err) {
      console.error('Failed to reload model data:', err);
    }
  }, []);

  // Scan models when model path changes (debounced)
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (scanTimerRef.current) clearTimeout(scanTimerRef.current); }, []);

  const scanModels = useCallback((path: string) => {
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    scanTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(API.modelScan, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modelPath: path }),
        });
        const models = await response.json() as ModelOption[];
        const selectedModel = models.length > 0 ? models[0].folder : '';
        setModelData(d => d ? { ...d, availableModels: models, selectedModel } : d);
        await postJson(API.modelSave, { modelPath: path, selectedModel });
        await reloadModelData();
      } catch (err) {
        console.error('Failed to scan models:', err);
      }
    }, DEBOUNCE_MS);
  }, [reloadModelData]);

  // Debounced save for api config (ip range + port only)
  const apiSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (apiSaveRef.current) clearTimeout(apiSaveRef.current); }, []);

  const saveApiConfig = useCallback((data: Pick<ApiPageData, 'acceptedIpRange' | 'port'>) => {
    if (apiSaveRef.current) clearTimeout(apiSaveRef.current);
    apiSaveRef.current = setTimeout(() => {
      postJson(API.configSave, data);
    }, DEBOUNCE_MS);
  }, []);

  // Loading: false as soon as error occurs or all initial data arrives (runtime deferred)
  const loading = !fetchError && (!modelData || !skillItems || !toolItems || !apiData);

  return {
    loading,
    error: fetchError,
    model: {
      data: modelData!,
      setModelPath: (path: string) => {
        setModelData(d => d ? { ...d, modelPath: path } : d);
        scanModels(path);
      },
      setSelectedModel: async (model: string) => {
        if (!modelData) return;
        setModelData(d => d ? { ...d, selectedModel: model } : d);
        await postJson(API.modelSave, { modelPath: modelData.modelPath, selectedModel: model });
        await reloadModelData();
      },
      updateHyperparam: (id: string, value: number) => {
        setModelData(d => {
          if (!d) return d;
          postJson(API.modelHyperparam, { paramId: id, value });
          return { ...d, hyperparams: d.hyperparams.map(h => h.id === id ? { ...h, value } : h) };
        });
      },
      resetHyperparam: (id: string) => {
        setModelData(d => {
          if (!d) return d;
          const param = d.hyperparams.find(h => h.id === id);
          if (!param) return d;
          postJson(API.modelHyperparam, { paramId: id, value: param.defaultValue });
          return { ...d, hyperparams: d.hyperparams.map(h => h.id === id ? { ...h, value: h.defaultValue } : h) };
        });
      },
    },
    runtime: {
      data: runtimeData,
      setSelectedDevice: (device: string) => {
        setRuntimeData(d => {
          if (!d) return d;
          postJson(API.runtimeSave, { inferenceDevice: device });
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
          postJson(API.configApiKey, { name, key });
          return { ...d, apiKeys: [...d.apiKeys, { name, key }] };
        });
      },
      removeApiKey: (index: number) => {
        setApiData(d => {
          if (!d) return d;
          fetch(`${API.configApiKey}/${index}`, { method: 'DELETE' })
            .catch(err => console.error('Failed to delete api key:', err));
          return { ...d, apiKeys: d.apiKeys.filter((_, i) => i !== index) };
        });
      },
    },
  };
}
