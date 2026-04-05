import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizard, type WizardData } from '../context/WizardContext';

interface SelectionStepProps {
  title: string;
  description: string;
  stepKey: keyof WizardData;
  nextRoute: string;
  options: any[];
}

const SelectionStep: React.FC<SelectionStepProps> = ({ title, description, stepKey, nextRoute, options }) => {
  const navigate = useNavigate();
  const { data, updateData } = useWizard();

  const handleSelect = (opt: any) => {
    updateData(stepKey, opt);
  };

  const handleNext = () => {
    if (data[stepKey]) {
      navigate(nextRoute);
    }
  };

  return (
    <div className="glass-panel" style={{ animation: 'fadeIn 0.5s ease' }}>
      <h2 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>{description}</p>

      <div className="options-grid">
        {options.map((opt) => (
          <div 
            key={opt.id}
            className={`option-card ${data[stepKey]?.id === opt.id ? 'selected' : ''}`}
            onClick={() => handleSelect(opt)}
            style={{ padding: '0', overflow: 'hidden' }}
          >
            <div style={{ height: '140px', width: '100%', background: '#000' }}>
              <img src={opt.img} alt={opt.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
            <div style={{ padding: '20px', width: '100%' }}>
              <h3 className="option-title">{opt.title}</h3>
              <p className="option-desc">{opt.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="nav-buttons">
        <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
          disabled={!data[stepKey]}
          style={{ opacity: !data[stepKey] ? 0.5 : 1, cursor: !data[stepKey] ? 'not-allowed' : 'pointer'}}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default SelectionStep;
