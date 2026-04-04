import { useEffect } from 'react';
import './Snackbar.css';

interface SnackbarProps {
  message: string | null;
  onDismiss: () => void;
}

export function Snackbar({ message, onDismiss }: SnackbarProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="snackbar">
      <span className="snackbar__text">{message}</span>
      <button className="snackbar__dismiss" onClick={onDismiss}>Dismiss</button>
    </div>
  );
}
