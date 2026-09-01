import React, { useState } from 'react';
import OllamaSetup from './components/OllamaSetup';
import CommandInput from './components/CommandInput';
import ParameterForm from './components/ParameterForm';

function App() {
  // 'setup' | 'input' | 'params'
  const [view, setView] = useState('setup');
  const [pendingAction, setPendingAction] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const handleSetupComplete = () => {
    setView('input');
  };

  const handleRequestParams = (data) => {
    setPendingAction(data);
    setView('params');
  };

  const handleParamSubmit = (result) => {
    setLastResult(result);
    setPendingAction(null);
    setView('input');
  };

  const handleParamCancel = () => {
    setPendingAction(null);
    setView('input');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {view === 'setup' && (
        <OllamaSetup onComplete={handleSetupComplete} />
      )}

      {view === 'input' && (
        <CommandInput
          onRequestParams={handleRequestParams}
          lastResult={lastResult}
        />
      )}

      {view === 'params' && pendingAction && (
        <ParameterForm
          action={pendingAction.action}
          params={pendingAction.params}
          autoFilled={pendingAction.autoFilled}
          currentDns={pendingAction.currentDns}
          onSubmit={handleParamSubmit}
          onCancel={handleParamCancel}
        />
      )}
    </div>
  );
}

export default App;
