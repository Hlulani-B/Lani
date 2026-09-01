import React, { useState, useEffect } from 'react';

const API = 'http://localhost:3000';

function OllamaSetup({ onComplete }) {
  const [status, setStatus] = useState(null);
  const [installing, setInstalling] = useState(false);
  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let eventSource = null;

    async function checkStatus() {
      try {
        const res = await fetch(`${API}/api/status`);
        const data = await res.json();
        setStatus(data);

        if (data.modelAvailable) {
          onComplete();
          return;
        }

        setChecking(false);

        // If Ollama is installed but model is not, start SSE and trigger install
        if (data.ollamaInstalled) {
          startSse();
          const installRes = await fetch(`${API}/api/install`, { method: 'POST' });
          const installData = await installRes.json();
          setInstalling(true);
          setMessage(installData.message || 'Pulling model...');
        }
      } catch (err) {
        console.error('Status check failed:', err);
        setChecking(false);
      }
    }

    function startSse() {
      eventSource = new EventSource(`${API}/api/events`);
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setPercent(data.percent || 0);
        setMessage(data.message || '');

        if (data.currentStep === 'ready') {
          setInstalling(false);
          onComplete();
        }
      };
      eventSource.onerror = () => {
        console.error('SSE connection error');
      };
    }

    checkStatus();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  const handleInstall = async () => {
    setInstalling(true);
    setMessage('Starting installation...');

    const eventSource = new EventSource(`${API}/api/events`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPercent(data.percent || 0);
      setMessage(data.message || '');

      if (data.currentStep === 'ready') {
        eventSource.close();
        setInstalling(false);
        onComplete();
      }
    };

    try {
      await fetch(`${API}/api/install`, { method: 'POST' });
    } catch (err) {
      console.error('Install failed:', err);
      setMessage('Installation failed. Please try again.');
      setInstalling(false);
      eventSource.close();
    }
  };

  if (checking) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Lani</h2>
        <p style={styles.subtitle}>Checking setup...</p>
      </div>
    );
  }

  // Ollama is ready — this component should not render
  if (status && status.modelAvailable) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lani</h2>
      <p style={styles.subtitle}>Windows Settings via Natural Language</p>

      <div style={styles.card}>
        {status && status.ollamaInstalled && !status.modelAvailable && (
          <>
            <p style={styles.info}>Preparing Lani for first use...</p>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${percent}%` }}>
                <span style={styles.progressText}>{percent}%</span>
              </div>
            </div>
            <p style={styles.message}>{message}</p>
          </>
        )}

        {(!status || !status.ollamaInstalled) && !installing && (
          <>
            <p style={styles.info}>
              Lani needs to download a few things before it can get started.
              This only happens once.
            </p>
            <button style={styles.button} onClick={handleInstall}>
              Get Started
            </button>
          </>
        )}

        {installing && (!status || !status.ollamaInstalled) && (
          <>
            <p style={styles.info}>Setting up Lani...</p>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${percent}%` }}>
                <span style={styles.progressText}>{percent}%</span>
              </div>
            </div>
            <p style={styles.message}>{message}</p>
          </>
        )}

        {status && status.currentStep === 'error' && (
          <p style={styles.error}>{message || 'Something went wrong. Please try again.'}</p>
        )}
      </div>
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
    margin: '0',
  },
};

export default OllamaSetup;
