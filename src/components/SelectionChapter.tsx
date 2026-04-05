import React from 'react';
import { useWizard, type WizardData } from '../context/WizardContext';
import { ChevronRight } from 'lucide-react';

interface SelectionChapterProps {
  title: string;
  description: string;
  stepKey: keyof WizardData;
  options: any[];
  id: string;
}

const SelectionChapter: React.FC<SelectionChapterProps> = ({ title, description, stepKey, options, id }) => {
  const { data, updateData } = useWizard();

  const handleSelect = (opt: any) => {
    updateData(stepKey, opt);
  };

  return (
    <section id={id} className="section-chapter animate-in">
      <div className="container-wide">
        <div style={{ maxWidth: '800px', marginBottom: '40px' }}>
          <h2 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '16px' }}>{title}</h2>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', lineHeight: '1.6' }}>{description}</p>
        </div>

        <div className="product-grid">
          {options.map((opt) => (
            <div 
              key={opt.id}
              className={`product-item ${data[stepKey]?.id === opt.id ? 'active' : ''}`}
              onClick={() => handleSelect(opt)}
            >
              <div className="product-image-container">
                <img src={opt.img} alt={opt.title} />
              </div>
              <div className="product-details">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{opt.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>{opt.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontWeight: '700', fontSize: '0.8rem' }}>
                  {data[stepKey]?.id === opt.id ? 'CONFIGURATION ACTIVE' : 'SELECT COMPONENT'}
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectionChapter;
