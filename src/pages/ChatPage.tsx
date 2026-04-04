import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'material-symbols/outlined.css';
import './ChatPage.css';

export function ChatPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  // Check if input has meaningful content (not just whitespace/newlines)
  const hasValidInput = input.trim().length > 0;

  const handleSubmit = useCallback(async () => {
    if (!hasValidInput || isSubmitting) return;

    const trimmedInput = input.trim();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/instruct/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: trimmedInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit instruction');
      }

      // Clear input after successful submission
      setInput('');
    } catch (error) {
      console.error('Error submitting instruction:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [hasValidInput, isSubmitting, input]);

  // Escape key to go back; Enter key handling for embedded browser
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape') {
        navigate('/');
        return;
      }

      if (e.key === 'Enter') {
        // Plain Enter: submit
        if (!e.shiftKey && !e.ctrlKey) {
          e.preventDefault();
          handleSubmit();
        }
        // Shift+Enter or Ctrl+Enter: let default behavior insert newline
      }
    },
    [navigate, handleSubmit],
  );

  return (
    <div className="chat-page">
      <div className="chat-glow">
        <div className="chat-container">
          <textarea
            ref={textareaRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What would you like to craft?"
            rows={1}
            autoFocus
          />
          {hasValidInput && (
            <div className="chat-toolbar">
              <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <span className="material-symbols-outlined submit-icon">send</span>
                <span>Send</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
