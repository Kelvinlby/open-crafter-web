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

  // Escape key to go back
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    },
    [navigate],
  );

  // Check if input has meaningful content (not just whitespace/newlines)
  const hasValidInput = input.trim().length > 0;

  const handleSubmit = async () => {
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
  };

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
