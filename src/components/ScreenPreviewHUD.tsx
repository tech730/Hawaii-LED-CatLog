import React from 'react';
import { useWizard } from '../context/WizardContext';
import { Monitor, Zap, Cpu, Maximize } from 'lucide-react';

const ScreenPreviewHUD: React.FC = () => {
  const { data } = useWizard();
  const { screenSize, ledModule, environment } = data;

  return (
    <div className="hud-container">
      <div className="container-wide" style={{ position: 'relative' }}>
        <div className="glass-card hud-panel animate-in" style={{ width: '320px', marginLeft: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
            <Monitor size={20} className="color-primary" style={{ color: '#3b82f6' }} />
            <h3 style={{ fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Live System Preview</h3>
          </div>

          {/* Minimal Screen Graphic */}
          <div style={{ 
            height: '140px', 
            background: '#000', 
            borderRadius: '8px', 
            margin: '15px 0',
            border: '2px solid #3b82f6',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img 
              src={ledModule?.img || '/images/indoor/LED-Module.jpg'} 
              alt="Screen Preview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} 
            />
            <div style={{ position: 'absolute', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {screenSize?.width}m x {screenSize?.height}m
            </div>
            {/* Assembly Effect Overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '1px solid rgba(0, 242, 255, 0.2)', pointerEvents: 'none' }}></div>
          </div>

          {/* Stats HUD */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                <Maximize size={10} /> RESOLUTION
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{screenSize?.resolution || '0 x 0'}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                <Zap size={10} /> MAX POWER
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{screenSize?.totalMaxPower ? (screenSize.totalMaxPower / 1000).toFixed(2) : '0.00'} kW</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                <Cpu size={10} /> SYSTEM TECH
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#3b82f6', textTransform: 'uppercase' }}>
                {environment || 'Select Env'} / {screenSize?.pitchName || 'No Pitch'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenPreviewHUD;
