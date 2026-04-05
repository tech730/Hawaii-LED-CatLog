import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Step1_Environment from './pages/Step1_Environment';
import Step2_Profile from './pages/Step2_Profile';
import Step4_ScreenSize from './pages/Step4_ScreenSize';

function App() {
  return (
    <div className="app-container-full">
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* Wizard Steps (if needed separate) */}
          <Route path="/step1" element={<Step1_Environment />} />
          <Route path="/step2" element={<Step2_Profile />} />
          <Route path="/step4" element={<Step4_ScreenSize />} />
        </Routes>
      </main>

      {/* Footer Branding */}
      <footer className="no-print" style={{ padding: '40px', textAlign: 'center', color: '#334155', fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
        © 2026 LED ARCHITECT PREMIUM SOLUTIONS | ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}

export default App;
