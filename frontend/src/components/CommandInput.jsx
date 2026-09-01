import React, { useState } from 'react';

const API = 'http://localhost:3000';

function CommandInput({ onRequestParams }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() }),
      });

      const data = await res.json();

      // Error from Ollama (gibberish, unrelated, etc.)
      if (data.error) {
        setError(data.message || 'Could not understand that request.');
        setLoading(false);
        return;
      }

      // Needs parameters — hand off to ParameterForm
      if (data.getParameters) {
        onRequestParams({
          action: data.action,
          params: data.params,
          autoFilled: data.autoFilled || {},
          currentDns: data.currentDns || null,
        });
        setLoading(false);
        return;
      }

      // Executed immediately — show result
      setResult({
        action: data.action,
        output: data.result || 'Done.',
      });
      setInput('');
    } catch (err) {
      setError('Failed to connect to the server. Is the backend running?');
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Lani</h1>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command... (e.g. turn up volume)"
          style={styles.input}
          disabled={loading}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            ...styles.button,
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>

      {error && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      {result && (
        <div style={styles.resultBox}>
          <p style={styles.resultAction}>{result.action}</p>
          <pre style={styles.resultOutput}>{result.output}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#000000',
    margin: '0',
    letterSpacing: '-0.02em',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    width: '100%',
    maxWidth: '560px',
    marginBottom: '1.5rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '2px solid #000000',
    borderRadius: '4px',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#f8f8f8',
    color: '#000000',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#000000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  errorBox: {
    width: '100%',
    maxWidth: '560px',
    padding: '1rem',
    backgroundColor: '#fff0f0',
    border: '2px solid #cc0000',
    borderRadius: '4px',
  },
  errorText: {
    margin: '0',
    fontSize: '0.9rem',
    color: '#cc0000',
  },
  resultBox: {
    width: '100%',
    maxWidth: '560px',
    padding: '1rem',
    backgroundColor: '#f0f8f0',
    border: '2px solid #000000',
    borderRadius: '4px',
  },
  resultAction: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#000000',
  },
  resultOutput: {
    margin: '0',
    fontSize: '0.85rem',
    color: '#333333',
    whiteSpace: 'pre-wrap',
    fontFamily: "'Consolas', 'Courier New', monospace",
  },
};

export default CommandInput;
