import { forwardRef } from 'react';
import 'material-symbols/rounded.css';
import type { ModelStatus } from '../types';
import './ModelFab.css';

interface ModelFabProps {
  status: ModelStatus;
  onClick: () => void;
}

export const ModelFab = forwardRef<HTMLButtonElement, ModelFabProps>(function ModelFab({ status, onClick }, ref) {
  const isBusy = status === 'loading' || status === 'unloading';
  const icon = isBusy ? 'autorenew' : status === 'loaded' ? 'pause' : 'deployed_code_update';
  const stateClass = isBusy ? 'model-fab--busy' : status === 'loaded' ? 'model-fab--loaded' : 'model-fab--unloaded';

  return (
    <button
      ref={ref}
      className={`model-fab ${stateClass}`}
      onClick={onClick}
      disabled={isBusy}
      title={isBusy ? 'Please wait...' : status === 'loaded' ? 'Unload model' : 'Load model'}
    >
      <span className={`material-symbols-rounded model-fab__icon${isBusy ? ' model-fab__icon--spin' : ''}`}>
        {icon}
      </span>
    </button>
  );
});
