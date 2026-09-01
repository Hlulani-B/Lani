import React, { useState, useEffect, useRef } from 'react';

const API = 'http://localhost:3000';

function OllamaSetup({ onComplete }) {
  const [installing, setInstalling] = useState(false);
  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [debug, setDebug] = useState('Waiting for SSE...');
  const eventSourceRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    console.log('[OllamaSetup] useEffect running, hasStarted:', hasStartedRef.current);
    setDebug(`useEffect running, hasStarted: ${hasStartedRef.current}`);
    
    // Prevent double-initialization (React StrictMode)
    if (hasStartedRef.current) {
      console.log('[OllamaSetup] Already started, skipping');
      return;
    }
    hasStartedRef.current = true;

    // First, check if already installed and ready
    console.log('[OllamaSetup] Checking /api/status first...');
    setDebug('Checking if already set up...');
    
    fetch(`${API}/api/status`)
      .then((res) => {
        console.log('[Status] Response status:', res.status);
        return res.json();
      })
      .then((statusData) => {
        console.log('[Status] Response data:', statusData);
        
        // If already ready, skip install UI entirely
        if (statusData.currentStep === 'ready' && statusData.ollamaInstalled && statusData.modelAvailable) {
          console.log('[OllamaSetup] Already ready, skipping to CommandInput');
          setDebug('Already set up, launching...');
          onComplete();
          return;
        }
        
        // Not ready yet, show install UI
        console.log('[OllamaSetup] Not ready, showing install UI');
        startInstallProcess();
      })
      .catch((err) => {
        console.error('[Status] Fetch error:', err);
        setDebug(`Status check failed: ${err.message}`);
        // Backend not reachable, show button
        setShowButton(true);
        setInstalling(false);
      });

    return () => {
      console.log('[OllamaSetup] Cleanup - closing SSE');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const startInstallProcess = () => {
    console.log('[OllamaSetup] Opening SSE connection to', `${API}/api/events`);
    setDebug('Opening SSE connection...');
    
    // Open SSE connection first to receive progress updates
    eventSourceRef.current = new EventSource(`${API}/api/events`);

    eventSourceRef.current.onopen = () => {
      console.log('[SSE] Connected to /api/events');
      setDebug('SSE connected');
    };

    eventSourceRef.current.onmessage = (event) => {
      console.log('[SSE] Raw event:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log('[SSE] Parsed:', data);
        setDebug(`Received: percent=${data.percent}, step=${data.currentStep}`);
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
      } catch (e) {
        console.error('[SSE] Parse error:', e);
        setDebug(`Parse error: ${e.message}`);
      }
    };

    eventSourceRef.current.onerror = (err) => {
      console.error('[SSE] Error:', err);
      setDebug(`SSE error: ${err.type}`);
      // Backend not reachable — show the Get Started button
      setShowButton(true);
      setInstalling(false);
    };

    // Call /api/install — backend checks if already installed, skips if so
    console.log('[OllamaSetup] Calling POST /api/install');
    setInstalling(true);
    setMessage(''); // Let SSE provide the live message

    fetch(`${API}/api/install`, { method: 'POST' })
      .then((res) => {
        console.log('[Install] Response status:', res.status);
        return res.json();
      })
      .then((data) => {
        console.log('[Install] Response data:', data);
        setDebug(`Install response: step=${data.status?.currentStep}, percent=${data.status?.percent}`);
        
        // Grab current progress from response immediately
        if (data.status) {
          setPercent(data.status.percent || 0);
          setMessage(data.status.message || '');
        }
        
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
        console.error('[Install] Fetch error:', err);
        setDebug(`Install error: ${err.message}`);
        // Backend not reachable
        setShowButton(true);
        setInstalling(false);
      });
  };

  const handleInstall = () => {
    setError(null);
    setShowButton(false);
    setInstalling(true);
    setMessage(''); // Let SSE provide the live message

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    eventSourceRef.current = new EventSource(`${API}/api/events`);
    eventSourceRef.current.onopen = () => {
      console.log('[SSE] Connected to /api/events (retry)');
    };
    eventSourceRef.current.onmessage = (event) => {
      console.log('[SSE] Raw event:', event.data);
      const data = JSON.parse(event.data);
      console.log('[SSE] Parsed:', data);
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
        console.log('[Install] Response:', data);
        setDebug(`Install response: step=${data.status?.currentStep}, percent=${data.status?.percent}`);
        
        // Grab current progress from response immediately
        if (data.status) {
          setPercent(data.status.percent || 0);
          setMessage(data.status.message || '');
        }
        
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
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${percent}%` }}>
              <span style={styles.progressText}>{percent}%</span>
            </div>
          </div>
          <p style={styles.message}>{message || 'Starting...'}</p>
          <p style={styles.debug}>Debug: {debug} | percent state: {percent}</p>
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
            Before we begin, please make sure you have Ollama installed and running on your computer.
          </p>
          <p style={styles.info}>
            Download it from <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" style={styles.link}>ollama.com</a>
          </p>
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} onClick={handleInstall}>
            I'm Ready
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
  link: {
    color: '#0066cc',
    textDecoration: 'underline',
  },
  error: {
    fontSize: '0.9rem',
    color: '#cc0000',
    margin: '0 0 1rem 0',
  },
  debug: {
    fontSize: '0.75rem',
    color: '#999999',
    margin: '0.5rem 0 0 0',
    fontFamily: 'monospace',
  },
};

export default OllamaSetup;
