import { useState, useCallback } from 'react';
import { API, postJson } from '../api';
import type { ModelStatus } from '../types';

export function useModelStatus(onError: (msg: string) => void) {
  const [modelStatus, setModelStatus] = useState<ModelStatus>('unloaded');

  const handleFabClick = useCallback(async () => {
    if (modelStatus === 'loading' || modelStatus === 'unloading') return;

    if (modelStatus === 'unloaded') {
      setModelStatus('loading');
      const ok = await postJson(API.modelLoad, {});
      if (ok) setModelStatus('loaded');
      else { setModelStatus('unloaded'); onError('Failed to load model.'); }
    } else {
      setModelStatus('unloading');
      const ok = await postJson(API.modelUnload, {});
      if (ok) setModelStatus('unloaded');
      else { setModelStatus('loaded'); onError('Failed to unload model.'); }
    }
  }, [modelStatus, onError]);

  return { modelStatus, handleFabClick };
}
