import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { WizardProvider } from './context/WizardContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <WizardProvider>
        <App />
      </WizardProvider>
    </HashRouter>
  </StrictMode>
);
