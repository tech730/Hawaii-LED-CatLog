import React from 'react';
import { useNavigate } from 'react-router-dom';

const Step2_Profile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-panel" style={{ animation: 'fadeIn 0.5s ease' }}>
      <h2 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>Company Profile</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        Please upload or update the company profile information here.
      </p>

      <div style={{ background: 'rgba(22, 27, 34, 0.5)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <img src="/images/profile/Company Profile.jpg" alt="Company Profile" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
      </div>

      <div className="nav-buttons">
        <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
        <button className="btn btn-primary" onClick={() => navigate('/step3')}>Next: About Us</button>
      </div>
    </div>
  );
};

export default Step2_Profile;
