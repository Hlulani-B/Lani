import React, { useState, useEffect, useRef } from 'react';

const API = 'http://localhost:3000';

function OllamaSetup({ onComplete }) {
  const [installing, setInstalling] = useState(false);
  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const eventSourceRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Prevent double-initialization (React StrictMode)
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Open SSE connection first to receive progress updates
    eventSourceRef.current = new EventSource(`${API}/api/events`);

    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPercent(data.percent || 0);
      setMessage(data.message || '');

      if (data.currentStep === 'ready') {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setInstalling(false);
        onComplete();
      }

      if (data.currentStep === 'error') {
        setError(data.message || 'Something went wrong.');
        setInstalling(false);
      }
    };

    eventSourceRef.current.onerror = () => {
      // Backend not reachable — show the Get Started button
      setShowButton(true);
      setInstalling(false);
    };

    // Call /api/install — backend checks if already installed, skips if so
    setInstalling(true);
    setMessage('Setting up Lani...');

    fetch(`${API}/api/install`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        // Check response directly — SSE might have fired before we connected
        if (data.status && data.status.currentStep === 'ready') {
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          setInstalling(false);
          onComplete();
          return;
        }
        if (data.status && data.status.currentStep === 'error') {
          setError(data.message || 'Something went wrong.');
          setInstalling(false);
          setShowButton(true);
        }
      })
      .catch((err) => {
        // Backend not reachable
        setShowButton(true);
        setInstalling(false);
      });

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const handleInstall = () => {
    setError(null);
    setShowButton(false);
    setInstalling(true);
    setMessage('Setting up Lani...');

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    eventSourceRef.current = new EventSource(`${API}/api/events`);
    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPercent(data.percent || 0);
      setMessage(data.message || '');

      if (data.currentStep === 'ready') {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setInstalling(false);
        onComplete();
      }

      if (data.currentStep === 'error') {
        setError(data.message || 'Something went wrong.');
        setInstalling(false);
        setShowButton(true);
      }
    };

    fetch(`${API}/api/install`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.status.currentStep === 'ready') {
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          setInstalling(false);
          onComplete();
          return;
        }
        if (data.status && data.status.currentStep === 'error') {
          setError(data.message || 'Something went wrong.');
          setInstalling(false);
          setShowButton(true);
        }
      })
      .catch((err) => {
        setError('Could not connect to server.');
        setInstalling(false);
        setShowButton(true);
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
      });
  };

  // Show progress bar when installing
  if (installing) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Lani</h2>
        <p style={styles.subtitle}>Windows Settings via Natural Language</p>
        <div style={styles.card}>
          <p style={styles.info}>Setting up Lani...</p>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${percent}%` }}>
              <span style={styles.progressText}>{percent}%</span>
            </div>
          </div>
          <p style={styles.message}>{message}</p>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  // Show Get Started button if backend not reachable or error occurred
  if (showButton) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Lani</h2>
        <p style={styles.subtitle}>Windows Settings via Natural Language</p>
        <div style={styles.card}>
          <p style={styles.info}>
            First time setup. Lani needs a couple of things installed before it can run.
          </p>
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} onClick={handleInstall}>
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // Brief loading state while checking
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lani</h2>
      <p style={styles.subtitle}>Checking setup...</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#000000',
    margin: '0 0 0.25rem 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666666',
    margin: '0 0 2rem 0',
  },
  card: {
    backgroundColor: '#f8f8f8',
    border: '2px solid #000000',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center',
  },
  info: {
    fontSize: '0.95rem',
    color: '#333333',
    lineHeight: '1.5',
    margin: '0 0 1.5rem 0',
  },
  progressTrack: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    height: '28px',
    marginBottom: '0.75rem',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.3s ease',
    minWidth: '40px',
  },
  progressText: {
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  message: {
    fontSize: '0.85rem',
    color: '#666666',
    margin: '0',
  },
  button: {
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#000000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    fontSize: '0.9rem',
    color: '#cc0000',
    margin: '0 0 1rem 0',
  },
};

export default OllamaSetup;
