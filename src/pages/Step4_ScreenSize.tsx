import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizard } from '../context/WizardContext';
import { Calculator } from 'lucide-react';

const PITCH_OPTIONS = [
  { id: 'p1.8', name: 'P1.86', pitch: 1.86, maxPower: 600, avgPower: 200 },
  { id: 'p2.5', name: 'P2.5', pitch: 2.5, maxPower: 700, avgPower: 230 },
  { id: 'p3.9', name: 'P3.91', pitch: 3.91, maxPower: 800, avgPower: 260 },
  { id: 'p4.8', name: 'P4.81', pitch: 4.81, maxPower: 850, avgPower: 280 },
];

const Step4_ScreenSize: React.FC = () => {
  const navigate = useNavigate();
  const { updateData } = useWizard();
  
  const [width, setWidth] = useState<number>(3); // meters
  const [height, setHeight] = useState<number>(2); // meters
  const [pitchOption, setPitchOption] = useState(PITCH_OPTIONS[2]);

  // Calculations
  const area = width * height;
  const resolutionW = Math.round((width * 1000) / pitchOption.pitch);
  const resolutionH = Math.round((height * 1000) / pitchOption.pitch);
  const totalPixels = resolutionW * resolutionH;
  
  const totalMaxPower = Math.round(area * pitchOption.maxPower);
  const totalAvgPower = Math.round(area * pitchOption.avgPower);

  const handleNext = () => {
    updateData('screenSize', {
      width, height, area,
      resolution: `${resolutionW} x ${resolutionH}`,
      totalPixels,
      totalMaxPower,
      totalAvgPower,
      pitchName: pitchOption.name
    });
    navigate('/step5');
  };

  return (
    <div className="glass-panel" style={{ animation: 'fadeIn 0.5s ease' }}>
      <h2 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>Screen Size & Specifications</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        Define your screen dimensions to automatically calculate resolution and power consumption.
      </p>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Controls */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c9d1d9' }}>Screen Width (meters)</label>
            <input 
              type="number" 
              value={width} 
              onChange={e => setWidth(Number(e.target.value))}
              style={{ padding: '10px', width: '100%', borderRadius: '6px', background: '#0d1117', border: '1px solid #30363d', color: '#fff' }}
              min="0.5" step="0.5"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c9d1d9' }}>Screen Height (meters)</label>
            <input 
              type="number" 
              value={height} 
              onChange={e => setHeight(Number(e.target.value))}
              style={{ padding: '10px', width: '100%', borderRadius: '6px', background: '#0d1117', border: '1px solid #30363d', color: '#fff' }}
              min="0.5" step="0.5"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c9d1d9' }}>Pixel Pitch (Resolution setup)</label>
            <select 
              style={{ padding: '10px', width: '100%', borderRadius: '6px', background: '#0d1117', border: '1px solid #30363d', color: '#fff' }}
              onChange={(e) => setPitchOption(PITCH_OPTIONS.find(p => p.id === e.target.value) || PITCH_OPTIONS[0])}
              value={pitchOption.id}
            >
              {PITCH_OPTIONS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual & Stats */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ 
            background: '#000', 
            border: '2px solid var(--primary-color)', 
            height: '200px', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 0 20px rgba(47, 129, 247, 0.2)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800" 
              alt="Screen Graphic" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, borderRadius: '6px' }} 
            />
            <div style={{ position: 'absolute', color: '#fff', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              {width}m x {height}m
            </div>
          </div>

          <div style={{ background: 'rgba(22, 27, 34, 0.8)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#c9d1d9' }}>
              <Calculator size={18} /> Specifications Overview
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.9rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Total Area:</span> <br/><strong style={{color: '#fff', fontSize: '1.1rem'}}>{area.toFixed(2)} m²</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Resolution:</span> <br/><strong style={{color: '#fff', fontSize: '1.1rem'}}>{resolutionW} x {resolutionH}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Total Pixels:</span> <br/><strong style={{color: '#fff', fontSize: '1.1rem'}}>{totalPixels.toLocaleString()}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Max Power:</span> <br/><strong style={{color: '#fff', fontSize: '1.1rem'}}>{(totalMaxPower/1000).toFixed(2)} kW</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Avg Power:</span> <br/><strong style={{color: '#fff', fontSize: '1.1rem'}}>{(totalAvgPower/1000).toFixed(2)} kW</strong></div>
            </div>
          </div>

        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next: LED Module</button>
      </div>
    </div>
  );
};

export default Step4_ScreenSize;
