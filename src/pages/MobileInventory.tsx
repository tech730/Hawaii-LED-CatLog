import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Calendar, User, Package, Download } from 'lucide-react';
import { syncService, type SavedConfig } from '../services/syncService';

const MobileInventory: React.FC = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<SavedConfig[]>([]);

  useEffect(() => {
    setConfigs(syncService.getAllConfigs());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this configuration?')) {
      syncService.deleteConfig(id);
      setConfigs(syncService.getAllConfigs());
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      fontFamily: 'Outfit, sans-serif'
    }}>
      
      {/* Mobile Top Bar */}
      <header style={{ 
        background: '#0f172a', 
        padding: '24px 20px', 
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '700' }}>Mobile Inventory</h1>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Equipment Manager</p>
        </div>
      </header>

      <div style={{ padding: '20px' }}>
        
        {configs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <Package size={60} color="#cbd5e1" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Saved BOMs</h3>
            <p style={{ fontSize: '0.9rem' }}>Use the LED Configurator and select 'Sync to Mobile' to see designs here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {configs.map(config => (
              <div key={config.id} style={{ 
                background: '#fff', 
                borderRadius: '16px', 
                padding: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px 0', color: '#0f172a' }}>{config.projectName}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
                      <User size={14} /> {config.clientName}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(config.id)} style={{ padding: '8px', borderRadius: '8px', color: '#f43f5e', border: 'none', background: '#fff5f7', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Resolution</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{config.data.resW}x{config.data.resH}</div>
                  </div>
                  <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Total Modules</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{config.data.totalUnits} Pcs</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <Calendar size={14} /> {new Date(config.timestamp).toLocaleDateString()}
                  </div>
                  <button onClick={() => alert('Feature coming soon: Send Request to Storekeeper')} style={{ background: '#0f172a', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Download size={14} /> REQUEST STOCK
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default MobileInventory;
