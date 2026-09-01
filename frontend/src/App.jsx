import React, { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState({
    ollamaInstalled: false,
    modelAvailable: false,
    installing: false,
    currentStep: '',
    message: '',
    percent: 0,
  });

  useEffect(() => {
    // Connect to SSE for live progress updates
    const eventSource = new EventSource('http://localhost:3000/api/events');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleInstall = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/install', {
        method: 'POST',
      });
      const data = await response.json();
      console.log('Install response:', data);
    } catch (error) {
      console.error('Install error:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Lani</h1>
      <p>Windows Settings Control via Natural Language</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Status</h2>
        <p><strong>Ollama Installed:</strong> {status.ollamaInstalled ? 'Yes' : 'No'}</p>
        <p><strong>Model Available:</strong> {status.modelAvailable ? 'Yes' : 'No'}</p>
        <p><strong>Current Step:</strong> {status.currentStep || 'None'}</p>
        <p><strong>Message:</strong> {status.message || 'None'}</p>
        
        {status.installing && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ 
              width: '100%', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${status.percent}%`, 
                backgroundColor: '#4caf50', 
                height: '24px',
                transition: 'width 0.3s ease',
                textAlign: 'center',
                lineHeight: '24px',
                color: 'white'
              }}>
                {status.percent}%
              </div>
            </div>
          </div>
        )}
        
        {!status.ollamaInstalled && !status.installing && (
          <button 
            onClick={handleInstall}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Install Ollama
          </button>
        )}
        
        {status.modelAvailable && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
            <strong>Lani is ready!</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
