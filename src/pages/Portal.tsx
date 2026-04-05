import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Monitor, ChevronRight, LayoutGrid, Zap } from 'lucide-react';

const Portal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top right, #1e293b, #0f172a)', 
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      
      {/* Branding Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px', animation: 'fadeIn 1s ease' }}>
        <img src="/images/LOGO.png" alt="Hawaii LED" style={{ height: '60px', marginBottom: '20px' }} />
        <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>COMMAND CENTER</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginTop: '10px' }}>Professional LED Ecosystem & Control</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '30px', 
        maxWidth: '1200px', 
        width: '100%' 
      }}>
        
        {/* Card 1: Configurator */}
        <div 
          onClick={() => navigate('/configurator')}
          className="portal-card"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '40px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}>
            <Monitor size={200} color="#3b82f6" />
          </div>
          <div style={{ background: '#3b82f6', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)' }}>
            <LayoutGrid size={30} color="#fff" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>LED Configurator</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
            Build professional screen layouts with real-time resolution and power calculations.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontWeight: 'bold' }}>
            Launch Designer <ChevronRight size={20} />
          </div>
        </div>

        {/* Card 2: Inventory */}
        <div 
          onClick={() => navigate('/inventory')}
          className="portal-card"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '40px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', opacity: 0.1 }}>
            <Smartphone size={200} color="#10b981" />
          </div>
          <div style={{ background: '#10b981', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }}>
            <Zap size={30} color="#fff" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Mobile Inventory</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
            Storekeeper & Sales hub for managing BOMs and equipment across projects.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 'bold' }}>
            Open Mobile App <ChevronRight size={20} />
          </div>
        </div>

      </div>

      {/* Styles for hover effect */}
      <style>{`
        .portal-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Portal;
