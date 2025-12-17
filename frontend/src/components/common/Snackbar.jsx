import { useEffect, useState } from 'react';

export default function Snackbar({ message, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      // Trigger animation after mount
      setTimeout(() => setShow(true), 10);
      
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        setShow(false);
        // Wait for animation to complete before calling onClose
        setTimeout(() => {
          onClose();
        }, 300);
      }, 3000);

      return () => {
        clearTimeout(timer);
        setShow(false);
      };
    } else {
      setShow(false);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`snackbar snackbar-${message.type} ${show ? 'snackbar-show' : ''}`}>
      <div className="snackbar-content">
        <span className="snackbar-icon">
          {message.type === 'success' ? '✓' : '✕'}
        </span>
        <span className="snackbar-message">{message.text}</span>
      </div>
    </div>
  );
}
