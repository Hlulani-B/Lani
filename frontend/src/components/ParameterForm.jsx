import React, { useState } from 'react';

const API = 'http://localhost:3000';

function ParameterForm({ action, params, autoFilled, currentDns, onSubmit, onCancel }) {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          params: values,
          autoFilled,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      onSubmit({
        action,
        output: data.result || 'Done.',
      });
    } catch (err) {
      setError('Failed to execute command. Check the backend is running.');
    }

    setLoading(false);
  };

  const getInputType = (type) => {
    switch (type) {
      case 'integer':
        return 'number';
      case 'password':
        return 'password';
      case 'path':
        return 'text';
      case 'ip':
        return 'text';
      default:
        return 'text';
    }
  };

  const getPlaceholder = (param) => {
    if (param.type === 'integer') return '0';
    if (param.type === 'ip') return '192.168.1.1';
    if (param.type === 'path') return 'C:\\path\\to\\file';
    if (param.type === 'password') return 'Enter password';
    return `Enter ${param.name}`;
  };

  const formatLabel = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{formatLabel(action.split('.').pop())}</h2>
        <p style={styles.action}>{action}</p>

        <form onSubmit={handleSubmit}>
          {/* Show auto-filled values as read-only */}
          {autoFilled && Object.keys(autoFilled).length > 0 && (
            <div style={styles.autoFilledSection}>
              <p style={styles.sectionLabel}>Auto-detected</p>
              {Object.entries(autoFilled).map(([key, value]) => (
                <div key={key} style={styles.field}>
                  <label style={styles.label}>{formatLabel(key)}</label>
                  <input
                    type="text"
                    value={typeof value === 'object' ? JSON.stringify(value) : String(value || '')}
                    readOnly
                    style={styles.readOnlyInput}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Show current DNS if available */}
          {currentDns && (
            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                Current DNS: {currentDns.dns1 || 'None'}
                {currentDns.dns2 ? `, ${currentDns.dns2}` : ''}
              </p>
            </div>
          )}

          {/* User-fillable parameters */}
          {params && params.length > 0 && (
            <div style={styles.paramsSection}>
              <p style={styles.sectionLabel}>Required</p>
              {params.map((param) => (
                <div key={param.name} style={styles.field}>
                  <label style={styles.label}>
                    {formatLabel(param.name)}
                    <span style={styles.typeHint}> ({param.type})</span>
                  </label>
                  <input
                    type={getInputType(param.type)}
                    placeholder={getPlaceholder(param)}
                    value={values[param.name] || ''}
                    onChange={(e) => handleChange(param.name, e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {error && (
            <p style={styles.error}>{error}</p>
          )}

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Executing...' : 'Execute'}
            </button>
          </div>
        </form>
      </div>
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
  card: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#f8f8f8',
    border: '2px solid #000000',
    borderRadius: '8px',
    padding: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#000000',
    margin: '0 0 0.25rem 0',
  },
  action: {
    fontSize: '0.8rem',
    color: '#666666',
    fontFamily: "'Consolas', 'Courier New', monospace",
    margin: '0 0 1.5rem 0',
  },
  autoFilledSection: {
    marginBottom: '1rem',
  },
  paramsSection: {
    marginBottom: '1rem',
  },
  sectionLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 0.75rem 0',
  },
  field: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#000000',
    marginBottom: '0.35rem',
  },
  typeHint: {
    fontWeight: '400',
    color: '#999999',
    fontSize: '0.8rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.75rem',
    fontSize: '0.95rem',
    border: '2px solid #000000',
    borderRadius: '4px',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    color: '#000000',
    boxSizing: 'border-box',
  },
  readOnlyInput: {
    width: '100%',
    padding: '0.6rem 0.75rem',
    fontSize: '0.95rem',
    border: '2px solid #cccccc',
    borderRadius: '4px',
    backgroundColor: '#e8e8e8',
    color: '#666666',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  infoBox: {
    padding: '0.6rem 0.75rem',
    backgroundColor: '#f0f0f0',
    border: '1px solid #cccccc',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  infoText: {
    margin: '0',
    fontSize: '0.85rem',
    color: '#333333',
  },
  error: {
    fontSize: '0.85rem',
    color: '#cc0000',
    margin: '0 0 1rem 0',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
  },
  cancelButton: {
    padding: '0.6rem 1.25rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#000000',
    backgroundColor: '#ffffff',
    border: '2px solid #000000',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '0.6rem 1.25rem',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#000000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ParameterForm;
