import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizard, type Environment } from '../context/WizardContext';
import { Monitor, Sun } from 'lucide-react';

const Step1_Environment: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateData } = useWizard();

  const handleSelect = (env: Environment) => {
    updateData('environment', env);
  };

  const handleNext = () => {
    if (data.environment) {
      navigate('/step2');
    }
  };

  return (
    <div className="glass-panel" style={{ animation: 'fadeIn 0.5s ease' }}>
      <h2 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>Select Environment</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        Will the LED screen be installed indoors or outdoors? This determines module brightness and IPs.
      </p>

      <div className="options-grid">
        <div 
          className={`option-card ${data.environment === 'indoor' ? 'selected' : ''}`}
          onClick={() => handleSelect('indoor')}
        >
          <Monitor className="option-icon" />
          <h3 className="option-title">Indoor Screen</h3>
          <p className="option-desc">Perfect for conferences, malls, and broadcast studios. Lower brightness, fine pixel pitch.</p>
        </div>

        <div 
          className={`option-card ${data.environment === 'outdoor' ? 'selected' : ''}`}
          onClick={() => handleSelect('outdoor')}
        >
          <Sun className="option-icon" />
          <h3 className="option-title">Outdoor / Rental</h3>
          <p className="option-desc">High brightness, IP65 waterproof rated. Ideal for events and advertising.</p>
        </div>
      </div>

      <div className="nav-buttons" style={{ justifyContent: 'flex-end' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
          disabled={!data.environment}
          style={{ opacity: !data.environment ? 0.5 : 1, cursor: !data.environment ? 'not-allowed' : 'pointer'}}
        >
          Next: Profile Configuration
        </button>
      </div>
    </div>
  );
};

export default Step1_Environment;
