import React, { useState, useEffect } from 'react';
import { Zap, Maximize, LayoutGrid, ArrowLeft, Printer, Settings } from 'lucide-react';

const SCENES = [
  { id: 'indoor', name: 'Indoor LED Screen', type: 'module' },
  { id: 'outdoor', name: 'Outdoor LED Screen', type: 'module' },
  { id: 'rental', name: 'Rental Cabinet', type: 'cabinet' },
  { id: 'cob', name: 'COB (Indoor)', type: 'module' },
  { id: 'gob', name: 'GOB (Indoor)', type: 'module' }
];

const BRANDS = [
  { id: 'hawaii', name: 'Hawaii LED', desc: 'Premium Official Range', img: '/images/hawaii-simulator.jpg' },
  { id: 'lampro', name: 'LAMPRO', desc: 'High Performance', img: '/images/JPG/Artboard 12-100.jpg' },
  { id: 'dahua', name: 'Dahua', desc: 'Security & Commercial', img: '/images/JPG/Artboard 5-100.jpg' },
  { id: 'custom', name: 'Customize LED', desc: 'Built to Spec', img: '/images/hawaii-simulator.jpg' },
];

const PITCH_SETS = {
  indoor: ['1.2', '1.5', '1.86', '2.0', '2.5', '3.0', '4.0'],
  outdoor: ['2.5', '3.0', '4.0', '5.9', '6.0', '6.6', '8.0', '10.0'],
  rental: ['1.9', '2.6', '3.9'],
  cob: ['1.2', '1.5', '1.86', '2.0', '2.5', '3.0', '4.0'],
  gob: ['1.2', '1.5', '1.86', '2.0', '2.5', '3.0', '4.0']
};

const CONTROL_SYSTEMS = [
  { 
    id: 'novastar', 
    name: 'Novastar', 
    group: 'High-Quality',
    models: [
      { id: 'tb20', name: 'Taurus TB20', ports: 2, capacity: 1300000, desc: 'Multimedia Player' },
      { id: 'tb40', name: 'Taurus TB40', ports: 2, capacity: 1300000, desc: 'Multimedia Player' },
      { id: 'tb60', name: 'Taurus TB60', ports: 4, capacity: 2300000, desc: 'High-End Player' },
      { id: 'tu40pro', name: 'TU40 Pro', ports: 4, capacity: 2600000, desc: 'Specialized Controller' },
      { id: 'vx600', name: 'VX600', ports: 6, capacity: 3900000, desc: 'All-in-One Controller' },
      { id: 'vx1000', name: 'VX1000', ports: 10, capacity: 6500000, desc: 'Professional Controller' },
      { id: 'vx2000pro', name: 'VX2000 Pro', ports: 20, capacity: 13000000, desc: 'Ultra-Professional Controller' },
      { id: 'h2', name: 'H2 Video Wall Processor', ports: 32, capacity: 13000000, desc: 'Modular Splicing Processor' },
      { id: 'h5', name: 'H5 Video Wall Processor', ports: 40, capacity: 31200000, desc: 'Modular Splicing Processor' },
      { id: 'h9', name: 'H9 Video Wall Processor', ports: 80, capacity: 65000000, desc: 'Modular Splicing Processor' },
    ]
  },
  {
    id: 'colorlight',
    name: 'Colorlight',
    group: 'High-Quality',
    models: [
      { id: 'x2s', name: 'X2s', ports: 2, capacity: 1300000, desc: 'Professional Controller' },
      { id: 'x4s', name: 'X4s', ports: 4, capacity: 2600000, desc: 'Professional Controller' },
      { id: 'x6', name: 'X6', ports: 6, capacity: 3900000, desc: 'Professional Controller' },
      { id: 'x8', name: 'X8', ports: 8, capacity: 5200000, desc: 'High-End Controller' },
      { id: 'x16', name: 'X16', ports: 16, capacity: 10000000, desc: 'Flagship Controller' },
      { id: 'z6', name: 'Z6', ports: 10, capacity: 6500000, desc: 'Broadcast Grade' },
    ]
  },
  {
    id: 'huidu',
    name: 'Huidu',
    group: 'Mid-Range',
    models: [
      { id: 'a3', name: 'A3', ports: 1, capacity: 650000, desc: 'Multimedia Player' },
      { id: 'a4', name: 'A4', ports: 2, capacity: 1300000, desc: 'Multimedia Player' },
      { id: 'a6', name: 'A6', ports: 4, capacity: 2300000, desc: 'Multimedia Player' },
      { id: 'vp1240', name: 'VP1240', ports: 4, capacity: 2600000, desc: 'Video Processor' },
      { id: 'vp1640', name: 'VP1640', ports: 6, capacity: 3900000, desc: 'Video Processor' },
    ]
  },
  {
    id: 'onbon',
    name: 'Onbon / BX',
    group: 'Mid-Range',
    models: [
      { id: 'y1', name: 'BX-Y1', ports: 2, capacity: 1300000, desc: 'Commercial Player' },
      { id: 'y3', name: 'BX-Y3', ports: 4, capacity: 2600000, desc: 'Commercial Player' },
      { id: 'y5', name: 'BX-Y5', ports: 8, capacity: 5200000, desc: 'High-End Player' },
    ]
  },
  {
    id: 'oem',
    name: 'Generic OEM',
    group: 'Low-Quality',
    models: [
      { id: 's1', name: 'Sender Box S1', ports: 1, capacity: 650000, desc: 'Basic Sender' },
      { id: 's2', name: 'Sender Box S2', ports: 2, capacity: 1300000, desc: 'Standard Sender' },
    ]
  },
];

const POWER_SUPPLIES = [
  { id: 'p1', name: 'Mean Well (Taiwan)', desc: 'Ultra Reliable' },
  { id: 'p2', name: 'Zhongdian', desc: 'Standard Grade' },
  { id: 'p3', name: 'G-Energy', desc: 'High Efficiency' },
  { id: 'p4', name: 'Chuanglian', desc: 'Value Grade' },
];

const RECEIVING_CARDS: Record<string, { model: string; capacity: number; spec: string }> = {
  novastar: { model: 'Novastar MRV416-N', capacity: 262144, spec: 'Advanced (Max 512x512 with PWM IC)' },
  colorlight: { model: 'Colorlight i9 Plus', capacity: 262144, spec: 'Ultra Capacity (512x512 Pixels)' },
  huidu: { model: 'Huidu R512T / R612', capacity: 131000, spec: 'Professional (256x512 Pixels)' },
  onbon: { model: 'Onbon BX-V75L', capacity: 262000, spec: 'Ultra Capacity (512x512 Pixels)' },
  oem: { model: 'Generic High-End Card', capacity: 65000, spec: 'Standard Capacity (256x256)' },
};

const Dashboard: React.FC = () => {
  // Local Config State
  const [activeSceneId, setActiveSceneId] = useState(SCENES[0].id);
  const [activeBrand, setActiveBrand] = useState(BRANDS[0]);
  const [activePitch, setActivePitch] = useState('2.5');
  const [widthCols, setWidthCols] = useState(5);
  const [heightRows, setHeightRows] = useState(3);
  const [activeControlBrand, setActiveControlBrand] = useState(CONTROL_SYSTEMS[0]);
  const [activeProcessor, setActiveProcessor] = useState(CONTROL_SYSTEMS[0].models[5]); // Default VX1000
  const [activePower, setActivePower] = useState(POWER_SUPPLIES[0]);
  const [showResults, setShowResults] = useState(false);

  // Report Customization State
  const [customParams, setCustomParams] = useState<any[]>([]);
  const [customBOM, setCustomBOM] = useState<any[]>([]);
  const [isReportCustomized, setIsReportCustomized] = useState(false);

  const activeScene = SCENES.find(s => s.id === activeSceneId) || SCENES[0];
  const availablePitches = PITCH_SETS[activeSceneId as keyof typeof PITCH_SETS] || PITCH_SETS.indoor;

  // Handle Scene Change: Reset pitch if not available in new scene
  useEffect(() => {
    if (!availablePitches.includes(activePitch)) {
      setActivePitch(availablePitches[0]);
    }
  }, [activeSceneId, availablePitches, activePitch]);

  // Derived Specs
  const isOutdoor = activeSceneId === 'outdoor';

  // Brand-Specific Specs
  let brightnessRange = '600-800';
  let viewingAngle = '140°(H)/140°(V)';
  let refreshRate = '3840';
  let grayscale = '12-bit to 14-bit';

  if (activeBrand.id === 'hawaii') {
    brightnessRange = isOutdoor ? '5000-6000' : '800-1000';
    viewingAngle = '140°(H)/140°(V)';
    refreshRate = '7680';
    grayscale = '14-bit to 16-bit';
  } else if (activeBrand.id === 'dahua') {
    brightnessRange = isOutdoor ? '4000-5000' : '600-800';
    viewingAngle = '160°(H)/160°(V)';
    refreshRate = '3840';
    grayscale = '12-bit to 14-bit';
  } else if (activeBrand.id === 'lampro') {
    brightnessRange = isOutdoor ? '4000-5000' : '450-500'; // User requested Lampro indoor 450-500
    viewingAngle = '140°(H)/140°(V)';
    refreshRate = '3840';
    grayscale = '12-bit to 14-bit';
  } else {
    // Custom
    brightnessRange = isOutdoor ? '4000-5000' : '600-800';
    viewingAngle = '160°(H)/160°(V)';
    refreshRate = '3840';
    grayscale = '12-bit to 14-bit';
  }

  // Physical specs
  const isRental = activeSceneId === 'rental';
  const unitW = isRental ? 0.5 : 0.32; // 500mm vs 320mm module
  const unitH = isRental ? 0.5 : 0.16; // 500mm vs 160mm module
  
  const totalWidth = (widthCols * unitW).toFixed(2);
  const totalHeight = (heightRows * unitH).toFixed(2);
  const totalArea = (widthCols * unitW * heightRows * unitH).toFixed(2);
  const totalUnits = widthCols * heightRows;
  
  // Power & Weight
  const weightPerSqm = 25; // User specified 25sqm weight (likely means 25kg/sqm)
  const totalWeight = (parseFloat(totalArea) * weightPerSqm).toFixed(1);
  
  const maxPowerPerSqm = isOutdoor ? 800 : 600;
  const typPowerPerSqm = isOutdoor ? 260 : 200;
  const powerMax = (parseFloat(totalArea) * maxPowerPerSqm).toFixed(0);
  const powerTyp = (parseFloat(totalArea) * typPowerPerSqm).toFixed(0);
  const ampsMax = (Number(powerMax) / 230).toFixed(1);
  
  const heatTyp = (Number(powerTyp) * 3.41).toFixed(0);
  const heatMax = (Number(powerMax) * 3.41).toFixed(0);

  // Power Supply BOM logic (60A 300W)
  let powerSupplyQty = 0;
  if (isRental) {
    powerSupplyQty = totalUnits; // 1 per 500x500 cabinet
  } else {
    // totalUnits = number of 320x160 modules
    powerSupplyQty = isOutdoor ? Math.ceil(totalUnits / 8) : Math.ceil(totalUnits / 10);
  }

  // Resolution & Control Ports
  const resW = Math.round((widthCols * unitW * 1000) / parseFloat(activePitch));
  const resH = Math.round((heightRows * unitH * 1000) / parseFloat(activePitch));
  const totalPixels = resW * resH;

  // Receiving Card lookup
  const currentCard = RECEIVING_CARDS[activeControlBrand.id] || RECEIVING_CARDS.oem;

  // Receiving Card logic (80% Safety Capacity)
  const receivingCardSafetyFactor = 0.8;
  const receivingCardQty = isRental ? totalUnits : Math.ceil(totalPixels / (currentCard.capacity * receivingCardSafetyFactor));
  const getDefaultParams = () => [
    { id: '1', group: 'p1', category: 'Technology / Scene', label: 'Scene', value: activeScene.name, unit: '-' },
    { id: '2', group: 'p1', category: 'Pixel Pitch', label: 'Pitch', value: `P${activePitch}`, unit: 'mm' },
    { id: '3', group: 'p1', category: 'Unit Size', label: 'Unit', value: `${unitW * 1000} x ${unitH * 1000}`, unit: 'mm' },
    { id: '4', group: 'p1', category: 'Quantity', label: 'Total Pcs', value: `${widthCols} x ${heightRows} (${totalUnits})`, unit: 'Pcs' },
    { id: '5', group: 'p2', category: 'Display Area', label: 'Total Area', value: totalArea, unit: 'm²' },
    { id: '6', group: 'p2', category: 'Resolution', label: 'Total Pixels', value: `${resW} x ${resH}`, unit: 'Pixels' },
    { id: '7', group: 'p2', category: 'Brightness', label: 'Max Brightness', value: brightnessRange, unit: 'nits' },
    { id: '8', group: 'p2', category: 'Viewing Angle', label: 'Angle', value: viewingAngle, unit: 'H/V' },
    { id: '9', group: 'p2', category: 'Refresh', label: 'Frequency', value: refreshRate, unit: 'Hz' },
    { id: '10', group: 'p2', category: 'Grayscale', label: 'Bit Depth', value: grayscale, unit: 'bit' },
    { id: '11', group: 'p2', category: 'Heat', label: 'Heat Output', value: `${heatTyp} / ${heatMax}`, unit: 'BTU/h' },
  ];

  const getDefaultBOM = () => [
    { id: 'b1', item: 'LED Module', model: `${activeBrand.name} P${activePitch} ${isRental ? 'Rental' : (isOutdoor ? 'Outdoor' : 'Indoor')}`, qty: totalUnits, spec: `${isRental ? '500x500mm' : '320x160mm'} Panel` },
    { id: 'b2', item: 'Receiving Card', model: currentCard.model, qty: receivingCardQty, spec: `${currentCard.spec} (Load limit: 80%)` },
    { id: 'b3', item: 'Controller', model: `${activeControlBrand.name} ${activeProcessor.name}`, qty: 1, spec: `${activeProcessor.ports} Ports / ${activeProcessor.capacity.toLocaleString()} Pixels` },
    { id: 'b4', item: 'Power Supply', model: `${activePower.name} 5V 40A/60A`, qty: powerSupplyQty, spec: activePower.desc },
    { id: 'b5', item: 'Total Weight', model: 'Calculated Structural Load', qty: 1, spec: `~ ${totalWeight} kg` },
    { id: 'b6', item: 'Power Consumption', model: 'Maximum Load @ 230V', qty: 1, spec: `${powerMax}W (Max) / ~ ${ampsMax}A` },
  ];

  const portsRequired = Math.ceil(totalPixels / 650000);
  const isOverCapacity = totalPixels > activeProcessor.capacity;

  // Sync customizations when config changes (only if not manually overridden)
  useEffect(() => {
    if (!isReportCustomized) {
      setCustomParams(getDefaultParams());
      setCustomBOM(getDefaultBOM());
    }
  }, [activeSceneId, activeBrand, activePitch, widthCols, heightRows, activeProcessor, activePower, isReportCustomized]);
  const SimulatorVisual = (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '400px' }}>
      
      {/* The LED Wall */}
      <div style={{ 
        position: 'relative',
        display: 'grid', 
        gridTemplateColumns: `repeat(${widthCols}, 1fr)`, 
        width: '100%',
        maxWidth: `${widthCols * (isRental ? 35 : 40)}px`,
        aspectRatio: `${totalWidth} / ${totalHeight}`,
        background: `url("/images/indoor/Hawaii Sigma Indoor P2.5-01--01-01.jpg") center/cover`,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        zIndex: 10,
        border: '1px solid #1e293b'
      }}>
        {Array.from({ length: totalUnits }).map((_, i) => (
          <div key={i} style={{ 
            width: '100%', height: '100%', 
            borderRight: '1px dashed rgba(255,255,255,0.3)',
            borderBottom: '1px dashed rgba(255,255,255,0.3)'
          }} />
        ))}

        {/* Dimension Guides: Top (Width) */}
        <div style={{ position: 'absolute', top: '-40px', left: 0, right: 0, height: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '4px', fontWeight: 'bold' }}>{totalWidth}m ({resW}px)</div>
          <div style={{ width: '100%', borderBottom: '1px dashed #94a3b8', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: '-4px', width: '1px', height: '8px', background: '#94a3b8' }} />
            <div style={{ position: 'absolute', right: 0, top: '-4px', width: '1px', height: '8px', background: '#94a3b8' }} />
          </div>
        </div>

        {/* Dimension Guides: Right (Height) */}
        <div style={{ position: 'absolute', right: '-80px', top: 0, bottom: 0, width: '60px', display: 'flex', alignItems: 'center' }}>
          <div style={{ height: '100%', borderRight: '1px dashed #94a3b8', position: 'relative', marginRight: '8px' }}>
            <div style={{ position: 'absolute', top: 0, right: '-4px', width: '8px', height: '1px', background: '#94a3b8' }} />
            <div style={{ position: 'absolute', bottom: 0, right: '-4px', width: '8px', height: '1px', background: '#94a3b8' }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#475569', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
            {totalHeight}m <br/>({resH}px)
          </div>
        </div>
      </div>

    </div>
  );

  // --------------------------------------------------------------------------
  // RENDER: RESULTS VIEW
  // --------------------------------------------------------------------------
  if (showResults) {
    return (
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
        <div className="no-print results-header-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={() => setShowResults(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <ArrowLeft size={24} />
            </button>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>System Configuration Results</h1>
          </div>
          <div className="hud-stats-inner" style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => window.print()}><Printer size={16}/> Print Report</button>
            <button className="btn-primary" style={{ background: '#0f172a' }}>Finalize Quote</button>
          </div>
        </div>

        {/* Print Header (Visible only when printing) */}
        <div className="print-only" style={{ display: 'none', marginBottom: '30px', textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '2.4rem', color: '#0f172a', margin: 0 }}>System Configuration Report</h1>
          <p style={{ color: '#64748b', marginTop: '8px' }}>{activeBrand.name} LED Solution | {new Date().toLocaleDateString()}</p>
        </div>

        {/* Parameters Section */}
        <div style={{ marginBottom: '45px' }}>
          <div style={{ background: '#0f172a', color: '#fff', padding: '11px 19px', fontWeight: 'bold', fontSize: '0.9rem' }}>Technical Parameters</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {/* Parameter Group 1: Product Details */}
              {customParams.filter(p => p.group === 'p1').map((p, idx) => (
                <tr key={p.id}>
                  {idx === 0 && (
                    <td rowSpan={customParams.filter(x => x.group === 'p1').length} style={{ width: '20%', border: '1px solid #e2e8f0', padding: '13px', background: '#f8fafc', fontWeight: 'bold', fontSize: '0.85rem' }}>Product Details</td>
                  )}
                  <td style={{ width: '40%', border: '1px solid #e2e8f0', padding: '11px 19px', fontSize: '0.85rem' }}>{p.category || p.label}</td>
                  <td style={{ width: '20%', border: '1px solid #e2e8f0', padding: '11px 19px', fontWeight: 'bold', fontSize: '0.85rem' }}>{p.value}</td>
                  <td style={{ width: '20%', border: '1px solid #e2e8f0', padding: '11px 19px', color: '#64748b', fontSize: '0.85rem' }}>{p.unit}</td>
                </tr>
              ))}

              {/* Parameter Group 2: Display Performance */}
              {customParams.filter(p => p.group === 'p2').map((p, idx) => (
                <tr key={p.id}>
                  {idx === 0 && (
                    <td rowSpan={customParams.filter(x => x.group === 'p2').length} style={{ border: '1px solid #e2e8f0', padding: '13px', background: '#f8fafc', fontWeight: 'bold', fontSize: '0.85rem' }}>Display Performance</td>
                  )}
                  <td style={{ border: '1px solid #e2e8f0', padding: '11px 19px', fontSize: '0.85rem' }}>{p.category || p.label}</td>
                  <td style={{ border: '1px solid #e2e8f0', padding: '11px 19px', fontWeight: 'bold', fontSize: '0.85rem' }}>{p.value}</td>
                  <td style={{ border: '1px solid #e2e8f0', padding: '11px 19px', color: '#64748b', fontSize: '0.85rem' }}>{p.unit}</td>
                </tr>
              ))}

              {/* Fallback for un-grouped custom items */}
              {customParams.filter(p => p.group !== 'p1' && p.group !== 'p2').map((p, idx) => (
                <tr key={p.id}>
                  {idx === 0 && (
                    <td rowSpan={customParams.filter(x => x.group !== 'p1' && x.group !== 'p2').length} style={{ border: '1px solid #e2e8f0', padding: '13px', background: '#f8fafc', fontWeight: 'bold', fontSize: '0.85rem' }}>Additional Specs</td>
                  )}
                  <td style={{ border: '1px solid #e2e8f0', padding: '11px 19px', fontSize: '0.85rem' }}>{p.label}</td>
                  <td style={{ border: '1px solid #e2e8f0', padding: '11px 19px', fontWeight: 'bold', fontSize: '0.85rem' }}>{p.value}</td>
                  <td style={{ border: '1px solid #e2e8f0', padding: '11px 19px', color: '#64748b', fontSize: '0.85rem' }}>{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Materials Section */}
        <div style={{ marginBottom: '45px' }}>
          <div style={{ background: '#0f172a', color: '#fff', padding: '11px 19px', fontWeight: 'bold', fontSize: '0.9rem' }}>Materials BOM</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem', textAlign: 'left' }}>
                <th style={{ padding: '11px 19px', borderBottom: '1px solid #e2e8f0' }}>Product Type</th>
                <th style={{ padding: '11px 19px', borderBottom: '1px solid #e2e8f0' }}>Model</th>
                <th style={{ padding: '11px 19px', borderBottom: '1px solid #e2e8f0' }}>Qty / Unit</th>
                <th style={{ padding: '11px 19px', borderBottom: '1px solid #e2e8f0' }}>Technical Specs</th>
              </tr>
            </thead>
            <tbody>
              {customBOM.map(b => (
                <tr key={b.id}>
                  <td style={{ padding: '11px 19px', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem' }}>{b.item}</td>
                  <td style={{ padding: '11px 19px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', fontSize: '0.85rem' }}>{b.model}</td>
                  <td style={{ padding: '11px 19px', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem' }}>{b.qty}</td>
                  <td style={{ padding: '11px 19px', borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#475569' }}>{b.spec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Wall Simulator inclusion for Print/Results */}
        <div style={{ marginTop: '40px' }}>
          <div style={{ background: '#0f172a', color: '#fff', padding: '12px 20px', fontWeight: 'bold' }}>Configuration Visual</div>
          <div style={{ background: '#f8fafc', padding: '60px 20px', border: '1px solid #e2e8f0', borderTop: 'none', overflow: 'hidden' }}>
            {SimulatorVisual}
          </div>
        </div>

        {/* Official Catalog Download */}
        <div className="no-print" style={{ marginTop: '40px', padding: '24px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '1.2rem' }}>{activeBrand.name} Technical Catalog</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#3b82f6' }}>Download the official PDF documentation, certifications, and detailed spec sheets.</p>
          </div>
          <a href={`/pdfs/${activeBrand.id}-catalog.pdf`} target="_blank" rel="noopener noreferrer" style={{ background: '#1d4ed8', color: '#fff', padding: '12px 24px', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={16}/> Download PDF
          </a>
        </div>

      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: MAIN CONFIGURATOR VIEW
  // --------------------------------------------------------------------------
  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh' }}>
      
      {/* Main App Header */}
      <header style={{ background: '#0f172a', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/images/LOGO.png" alt="Hawaii LED Logo" style={{ height: '40px', width: 'auto' }} />
          <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '0.025em' }}>CONFIGURATOR PRO</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Settings size={20} color="#94a3b8" style={{ cursor: 'pointer' }} />
        </div>
      </header>

      <div className="mobile-p-20" style={{ padding: '40px 20px', maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* HUD / Data Summary Bar */}
        <div className="glass-card hud-stats-bar" style={{ padding: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderLeft: '4px solid #0f172a', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>{activeBrand.name} Configurator</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{activeScene.name} | P{activePitch} | {brightnessRange} nits</p>
        </div>
        <div className="hud-stats-inner" style={{ display: 'flex', gap: '30px', textAlign: 'right', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><Maximize size={12} style={{marginRight:'4px'}}/>RESOLUTION</div>
            <div style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary)' }}>{resW} x {resH}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><LayoutGrid size={12} style={{marginRight:'4px'}}/>AREA / QTY</div>
            <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>{totalArea} m² / {totalUnits}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><Zap size={12} style={{marginRight:'4px'}}/>POWER (Max/Avg)</div>
            <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>{powerMax}W / {powerTyp}W</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>Electr: ~ {ampsMax}A @ 230V</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><LayoutGrid size={12} style={{marginRight:'4px'}}/>PORTS REQ</div>
            <div style={{ fontWeight: '700', fontSize: '1.2rem', color: isOverCapacity ? '#ef4444' : 'inherit' }}>{portsRequired} Cat6</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>WEIGHT</div>
            <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>{totalWeight} kg</div>
          </div>
          <button className="btn-outline" style={{ height: '40px', padding: '0 24px', borderRadius: '4px', fontWeight: 'bold', border: isOverCapacity ? '2px solid #ef4444' : '1px solid #e2e8f0' }} onClick={() => setShowResults(true)}>
            View Results
          </button>
        </div>
      </div>

      {/* Main 5-Panel Layout */}
      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '15px', marginBottom: '24px' }}>
        
        {/* Panel 1: Select Scene */}
        <div className="glass-card" style={{ padding: '15px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--primary)', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>1: Select Scene</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {SCENES.map(scene => (
              <button 
                key={scene.id}
                onClick={() => setActiveSceneId(scene.id)}
                style={{
                  padding: '8px 12px',
                  textAlign: 'left',
                  background: activeSceneId === scene.id ? '#eff6ff' : 'transparent',
                  border: `1px solid ${activeSceneId === scene.id ? '#3b82f6' : '#e2e8f0'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: activeSceneId === scene.id ? '#1e40af' : '#475569',
                  fontSize: '0.9rem'
                }}
              >
                {scene.name}
              </button>
            ))}
          </div>
        </div>

        {/* Panel 2: Brand & Pitch */}
        <div className="glass-card" style={{ padding: '15px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--primary)', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>2: Brand & Pitch</h3>
          <div style={{ marginBottom: '12px' }}>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              {BRANDS.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => setActiveBrand(brand)}
                  style={{
                    padding: '6px',
                    fontSize: '0.8rem',
                    background: activeBrand.id === brand.id ? '#3b82f6' : '#f1f5f9',
                    color: activeBrand.id === brand.id ? '#fff' : '#334155',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {availablePitches.map(pitch => (
              <button
                key={pitch}
                onClick={() => setActivePitch(pitch)}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.85rem',
                  background: activePitch === pitch ? '#10b981' : 'transparent',
                  color: activePitch === pitch ? '#fff' : '#475569',
                  border: `1px solid ${activePitch === pitch ? '#10b981' : '#cbd5e1'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                P{pitch}
              </button>
            ))}
          </div>
        </div>

        {/* Panel 3: Size */}
        <div className="glass-card" style={{ padding: '15px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--primary)', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>3: Screen Size</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', color: '#64748b' }}>{isRental ? 'CABINET' : 'MODULE'} COLUMNS (W)</label>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
              <button onClick={() => setWidthCols(Math.max(1, widthCols - 1))} style={{ width: '30px', height: '30px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>-</button>
              <input 
                type="number" 
                value={widthCols} 
                onChange={(e) => setWidthCols(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '50px', textAlign: 'center', fontWeight: 'bold', border: 'none', background: 'transparent', outline: 'none' }}
              />
              <button onClick={() => setWidthCols(widthCols + 1)} style={{ width: '30px', height: '30px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>+</button>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Unit: {unitW}m</span>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#64748b' }}>{isRental ? 'CABINET' : 'MODULE'} ROWS (H)</label>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
              <button onClick={() => setHeightRows(Math.max(1, heightRows - 1))} style={{ width: '30px', height: '30px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>-</button>
              <input 
                type="number" 
                value={heightRows} 
                onChange={(e) => setHeightRows(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '50px', textAlign: 'center', fontWeight: 'bold', border: 'none', background: 'transparent', outline: 'none' }}
              />
              <button onClick={() => setHeightRows(heightRows + 1)} style={{ width: '30px', height: '30px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>+</button>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Unit: {unitH}m</span>
          </div>
        </div>

        {/* Panel 4: Control System */}
        <div className="glass-card" style={{ padding: '15px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--primary)', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>4: Control System</h3>
          <div style={{ marginBottom: '8px', fontSize: '0.75rem', fontWeight: '600', color: isOverCapacity ? '#ef4444' : '#64748b', background: isOverCapacity ? '#fef2f2' : 'transparent', padding: '4px', borderRadius: '4px' }}>
             Required: ~ {portsRequired} Cat6 Port(s)
             {isOverCapacity && <div style={{ fontSize: '0.65rem' }}>⚠️ Upgrade Controller</div>}
          </div>
          
          {/* Brand Switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '8px' }}>
            {CONTROL_SYSTEMS.map(brand => (
              <button key={brand.id} onClick={() => { setActiveControlBrand(brand); setActiveProcessor(brand.models[0]); }} style={{
                padding: '4px',
                fontSize: '0.75rem',
                background: activeControlBrand.id === brand.id ? '#3b82f6' : '#f1f5f9',
                color: activeControlBrand.id === brand.id ? '#fff' : '#475569',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                {brand.name}
              </button>
            ))}
          </div>

          {/* Model Switcher */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
            {activeControlBrand.models.map(m => (
              <button key={m.id} onClick={() => setActiveProcessor(m)} style={{
                padding: '6px 8px',
                textAlign: 'left',
                background: activeProcessor.id === m.id ? '#eff6ff' : 'transparent',
                border: `1px solid ${activeProcessor.id === m.id ? '#3b82f6' : '#e2e8f0'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{m.name}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{m.ports}P</span>
              </button>
            ))}
          </div>
        </div>

        {/* Panel 5: Power Supply */}
        <div className="glass-card" style={{ padding: '15px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--primary)', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>5: Power Supply</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {POWER_SUPPLIES.map(p => (
              <button key={p.id} onClick={() => setActivePower(p)} style={{
                padding: '6px 10px',
                textAlign: 'left',
                background: activePower.id === p.id ? '#eff6ff' : 'transparent',
                border: `1px solid ${activePower.id === p.id ? '#3b82f6' : '#e2e8f0'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Panel 6: Report Customization */}
        <div className="glass-card" style={{ padding: '15px', borderLeft: isReportCustomized ? '4px solid #f59e0b' : '4px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--primary)', margin: 0 }}>6: Report Editor</h3>
            <button 
              onClick={() => setIsReportCustomized(!isReportCustomized)}
              style={{ padding: '4px 8px', fontSize: '0.7rem', background: isReportCustomized ? '#f59e0b' : '#64748b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {isReportCustomized ? 'MANUAL MODE' : 'AUTO MODE'}
            </button>
          </div>

          {!isReportCustomized ? (
            <div style={{ fontSize: '0.75rem', color: '#64748b', background: '#f8fafc', padding: '10px', borderRadius: '4px' }}>
              Report uses automatic calculations. Click <strong>MANUAL MODE</strong> to customize rows.
            </div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px', color: '#0f172a' }}>Parameters</div>
              {customParams.map((p, idx) => (
                <div key={p.id} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  <input style={{ flex: 1, fontSize: '0.7rem', padding: '2px 4px' }} value={p.label} onChange={(e) => {
                    const newP = [...customParams];
                    newP[idx].label = e.target.value;
                    setCustomParams(newP);
                  }} />
                  <input style={{ width: '60px', fontSize: '0.7rem', padding: '2px 4px' }} value={p.value} onChange={(e) => {
                    const newP = [...customParams];
                    newP[idx].value = e.target.value;
                    setCustomParams(newP);
                  }} />
                  <button onClick={() => setCustomParams(customParams.filter((_, i) => i !== idx))} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                </div>
              ))}
              <button 
                onClick={() => setCustomParams([...customParams, { id: Date.now().toString(), label: 'New Param', value: 'Value', unit: '-' }])}
                style={{ width: '100%', padding: '4px', fontSize: '0.7rem', marginTop: '4px', border: '1px dashed #cbd5e1', background: 'none', cursor: 'pointer' }}
              >+ Add Param</button>

              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '12px 0 8px', color: '#0f172a' }}>Materials BOM</div>
              {customBOM.map((b, idx) => (
                <div key={b.id} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  <input style={{ flex: 1, fontSize: '0.7rem', padding: '2px 4px' }} value={b.item} onChange={(e) => {
                    const newB = [...customBOM];
                    newB[idx].item = e.target.value;
                    setCustomBOM(newB);
                  }} />
                  <input style={{ width: '40px', fontSize: '0.7rem', padding: '2px 4px' }} value={b.qty} onChange={(e) => {
                    const newB = [...customBOM];
                    newB[idx].qty = e.target.value;
                    setCustomBOM(newB);
                  }} />
                  <button onClick={() => setCustomBOM(customBOM.filter((_, i) => i !== idx))} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                </div>
              ))}
              <button 
                onClick={() => setCustomBOM([...customBOM, { id: Date.now().toString(), item: 'New Item', model: 'Model Name', qty: 1, spec: 'Tech Spec' }])}
                style={{ width: '100%', padding: '4px', fontSize: '0.7rem', marginTop: '4px', border: '1px dashed #cbd5e1', background: 'none', cursor: 'pointer' }}
              >+ Add BOM Item</button>
            </div>
          )}

          <button 
            onClick={() => setShowResults(true)} 
            style={{ 
              width: '100%', 
              marginTop: '20px', 
              padding: '12px', 
              background: '#0f172a', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Printer size={18} /> GENERATE REPORT
          </button>
        </div>


      </div>

      {/* Advanced Simulator */}
      <div className="glass-card" style={{ padding: '0', background: '#f8fafc', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', minHeight: '600px', border: '1px solid #e2e8f0' }}>
        
        {/* Header toolbar for simulator */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <div style={{ color: '#0f172a', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Settings size={18} color="#3b82f6"/> 
             Interactive Wall Simulator
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Unit Layout: {isRental ? '500x500mm Cabinet' : '320x160mm Module'}
          </div>
        </div>

        {/* Canvas Area */}
        <div style={{ flex: 1, position: 'relative', padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* A large wrapper for the interactive elements */}
          {SimulatorVisual}
        </div>
      </div>

      </div>
    </div>
  );
};

export default Dashboard;
