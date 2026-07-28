import React, { useState } from 'react';
import { Download, FileText, Layers } from 'lucide-react';
import { downloadDXFFile } from '../services/dxfExporter';
import { exportMultiPageTechnicalDrawingPDF } from '../services/pdfDrawingExporter';

export interface ScreenDrawingProps {
  brandName: string;
  sceneName: string;
  pitch: string;
  widthCols: number;
  heightRows: number;
  unitW: number; // in meters (0.5 or 0.32)
  unitH: number; // in meters (0.5 or 0.16)
  totalWidthM: string;
  totalHeightM: string;
  totalArea: string;
  resW: number;
  resH: number;
  totalUnits: number;
  isRental: boolean;
  processor: string;
  powerSupply: string;
  totalWeightKg: string;
  powerMaxW: string;
  receivingCardQty: number;
}

type ViewMode = 'front' | 'top' | 'side' | 'rear';
type ThemeMode = 'blueprint' | 'dark' | 'clean';

export const ScreenDrawingStudio: React.FC<ScreenDrawingProps> = (props) => {
  const [viewMode, setViewMode] = useState<ViewMode>('front');
  const [themeMode, setThemeMode] = useState<ThemeMode>('blueprint');

  // Layer Toggles
  const [showGridLabels, setShowGridLabels] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showWiringLines, setShowWiringLines] = useState(true);
  const [showHumanScale, setShowHumanScale] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const unitWidthMm = Math.round(props.unitW * 1000);
  const unitHeightMm = Math.round(props.unitH * 1000);
  const totalWidthMm = props.widthCols * unitWidthMm;
  const totalHeightMm = props.heightRows * unitHeightMm;

  // Theme Styling Map
  const themeStyles = {
    blueprint: {
      bg: '#0f172a',
      gridBorder: 'rgba(56, 189, 248, 0.4)',
      gridFill: 'rgba(15, 23, 42, 0.8)',
      textMain: '#38bdf8',
      textSub: '#94a3b8',
      dimLine: '#38bdf8',
      dataCable: '#ef4444',
      powerCable: '#eab308',
      cardColor: '#10b981',
      frameColor: '#64748b',
      giSheet: '#0284c7',
      msTube40: '#f59e0b',
      msTube50: '#ec4899',
      magnetColor: '#e11d48'
    },
    dark: {
      bg: '#050505',
      gridBorder: 'rgba(16, 185, 129, 0.5)',
      gridFill: 'rgba(10, 10, 10, 0.9)',
      textMain: '#10b981',
      textSub: '#6b7280',
      dimLine: '#10b981',
      dataCable: '#f43f5e',
      powerCable: '#f59e0b',
      cardColor: '#3b82f6',
      frameColor: '#4b5563',
      giSheet: '#059669',
      msTube40: '#d97706',
      msTube50: '#db2777',
      magnetColor: '#dc2626'
    },
    clean: {
      bg: '#ffffff',
      gridBorder: '#1e293b',
      gridFill: '#f8fafc',
      textMain: '#0f172a',
      textSub: '#64748b',
      dimLine: '#0284c7',
      dataCable: '#dc2626',
      powerCable: '#d97706',
      cardColor: '#059669',
      frameColor: '#94a3b8',
      giSheet: '#2563eb',
      msTube40: '#d97706',
      msTube50: '#c026d3',
      magnetColor: '#b91c1c'
    }
  };

  const currentTheme = themeStyles[themeMode];

  // Multi-Page PDF Export Handler (Includes All 4 Views in 1 Single PDF File)
  const handlePDFExport = async () => {
    setIsExporting(true);
    const initialView = viewMode;

    const viewsToCapture: { mode: ViewMode; title: string }[] = [
      { mode: 'front', title: '01: Front Elevation' },
      { mode: 'top', title: '02: Top View (80mm Section)' },
      { mode: 'side', title: '03: Side View (80mm Section)' },
      { mode: 'rear', title: '04: Rear Cabling & Wiring Loop' }
    ];

    const capturedElements: { title: string; element: HTMLElement }[] = [];

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    for (const v of viewsToCapture) {
      setViewMode(v.mode);
      await delay(150); // wait for view render
      const el = document.getElementById('technical-drawing-canvas-area');
      if (el) {
        capturedElements.push({ title: v.title, element: el });
      }
    }

    // Restore original UI view for user
    setViewMode(initialView);

    await exportMultiPageTechnicalDrawingPDF(
      {
        drawingElementId: 'technical-drawing-canvas-area',
        filename: `${props.brandName.replace(/\s+/g, '_')}_Complete_Drawing_P${props.pitch}_${props.totalWidthM}x${props.totalHeightM}m.pdf`,
        projectInfo: {
          brandName: props.brandName,
          sceneName: props.sceneName,
          pitch: props.pitch,
          widthCols: props.widthCols,
          heightRows: props.heightRows,
          totalWidthM: props.totalWidthM,
          totalHeightM: props.totalHeightM,
          resW: props.resW,
          resH: props.resH,
          totalUnits: props.totalUnits,
          processor: props.processor,
          powerSupply: props.powerSupply,
          totalWeightKg: props.totalWeightKg,
          powerMaxW: props.powerMaxW
        }
      },
      capturedElements
    );

    setIsExporting(false);
  };

  // DXF CAD Export Handler
  const handleDXFExport = () => {
    downloadDXFFile({
      brandName: props.brandName,
      sceneName: props.sceneName,
      pitch: props.pitch,
      widthCols: props.widthCols,
      heightRows: props.heightRows,
      unitWidthMm,
      unitHeightMm,
      totalWidthM: props.totalWidthM,
      totalHeightM: props.totalHeightM,
      resW: props.resW,
      resH: props.resH,
      totalUnits: props.totalUnits
    }, `${props.brandName.replace(/\s+/g, '_')}_CAD_Drawing.dxf`);
  };

  // PNG Export Handler
  const handlePNGExport = () => {
    const el = document.getElementById('technical-drawing-canvas-area');
    if (!el) return;
    import('html2canvas').then(html2canvasModule => {
      html2canvasModule.default(el, { backgroundColor: currentTheme.bg, scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${props.brandName}_Drawing_${props.totalWidthM}x${props.totalHeightM}m.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    });
  };

  return (
    <div style={{ background: '#0f172a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b', color: '#fff', margin: '20px 0' }}>
      
      {/* Studio Header Toolbar */}
      <div style={{ background: '#1e293b', padding: '14px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={20} color="#38bdf8" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Technical CAD Drawing Studio</h3>
          <span style={{ fontSize: '0.75rem', background: '#0369a1', color: '#e0f2fe', padding: '2px 8px', borderRadius: '10px' }}>
            {props.totalWidthM}m x {props.totalHeightM}m ({props.resW}x{props.resH}px)
          </span>
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: 'flex', gap: '4px', background: '#0f172a', padding: '4px', borderRadius: '6px' }}>
          <button 
            onClick={() => setViewMode('front')}
            style={{ padding: '6px 12px', fontSize: '0.8rem', background: viewMode === 'front' ? '#38bdf8' : 'transparent', color: viewMode === 'front' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            01: Front View
          </button>
          <button 
            onClick={() => setViewMode('top')}
            style={{ padding: '6px 12px', fontSize: '0.8rem', background: viewMode === 'top' ? '#38bdf8' : 'transparent', color: viewMode === 'top' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            02: Top View (80mm Section)
          </button>
          <button 
            onClick={() => setViewMode('side')}
            style={{ padding: '6px 12px', fontSize: '0.8rem', background: viewMode === 'side' ? '#38bdf8' : 'transparent', color: viewMode === 'side' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            03: Side View (80mm Section)
          </button>
          <button 
            onClick={() => setViewMode('rear')}
            style={{ padding: '6px 12px', fontSize: '0.8rem', background: viewMode === 'rear' ? '#38bdf8' : 'transparent', color: viewMode === 'rear' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            04: Wiring Loop
          </button>
        </div>

        {/* Theme Switcher */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Theme:</span>
          <button onClick={() => setThemeMode('blueprint')} style={{ padding: '4px 8px', fontSize: '0.75rem', background: themeMode === 'blueprint' ? '#0284c7' : '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Blueprint</button>
          <button onClick={() => setThemeMode('dark')} style={{ padding: '4px 8px', fontSize: '0.75rem', background: themeMode === 'dark' ? '#059669' : '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Dark CAD</button>
          <button onClick={() => setThemeMode('clean')} style={{ padding: '4px 8px', fontSize: '0.75rem', background: themeMode === 'clean' ? '#e2e8f0' : '#334155', color: themeMode === 'clean' ? '#0f172a' : '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>White Paper</button>
        </div>
      </div>

      {/* Control Layer Toggles & Export Action Bar */}
      <div style={{ background: '#0f172a', padding: '10px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={showDimensions} onChange={(e) => setShowDimensions(e.target.checked)} /> Dimensions
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={showGridLabels} onChange={(e) => setShowGridLabels(e.target.checked)} /> Unit Labels
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={showWiringLines} onChange={(e) => setShowWiringLines(e.target.checked)} /> Cabling Paths
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={showHumanScale} onChange={(e) => setShowHumanScale(e.target.checked)} /> Human Scale
          </label>
        </div>

        {/* Primary Download Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handlePDFExport} 
            disabled={isExporting}
            style={{ 
              background: '#0284c7', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '0.85rem' 
            }}
          >
            <FileText size={16} /> {isExporting ? 'Generating PDF...' : 'Download PDF Drawing'}
          </button>
          
          <button 
            onClick={handleDXFExport} 
            style={{ 
              background: '#15803d', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 14px', 
              borderRadius: '6px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '0.85rem' 
            }}
          >
            <Download size={16} /> AutoCAD (.DXF)
          </button>

          <button 
            onClick={handlePNGExport} 
            style={{ 
              background: '#334155', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 14px', 
              borderRadius: '6px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '0.85rem' 
            }}
          >
            <Download size={16} /> PNG Image
          </button>
        </div>
      </div>

      {/* Technical Drawing Canvas Area */}
      <div 
        id="technical-drawing-canvas-area" 
        style={{ 
          background: currentTheme.bg, 
          padding: '40px 60px 80px 60px', 
          position: 'relative', 
          minHeight: '560px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        
        {/* Drawing Title Header overlay */}
        <div style={{ position: 'absolute', top: '15px', left: '20px', fontSize: '0.75rem', color: currentTheme.textSub }}>
          <div style={{ fontWeight: 'bold', color: currentTheme.textMain }}>VIEW MODE: {viewMode.toUpperCase()} CAD SECTION</div>
          <div>Structure Depth: 80mm | Outer Box: {totalWidthMm + 2} x {totalHeightMm + 2} x 80mm</div>
        </div>

        {/* Human Scale Reference */}
        {showHumanScale && (
          <div style={{ 
            position: 'absolute', 
            left: '30px', 
            bottom: '80px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            opacity: 0.6
          }}>
            <svg width="24" height="60" viewBox="0 0 24 60" fill="none" stroke={currentTheme.textSub} strokeWidth="1.5">
              <circle cx="12" cy="8" r="6" />
              <line x1="12" y1="14" x2="12" y2="36" />
              <line x1="4" y1="20" x2="20" y2="20" />
              <line x1="12" y1="36" x2="6" y2="58" />
              <line x1="12" y1="36" x2="18" y2="58" />
            </svg>
            <span style={{ fontSize: '0.65rem', color: currentTheme.textSub, marginTop: '2px' }}>Human (1.75m)</span>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 01: FRONT ELEVATION & REAR CABLING */}
        {/* ------------------------------------------------------------------ */}
        {(viewMode === 'front' || viewMode === 'rear') && (
          <div style={{ position: 'relative', width: '100%', maxWidth: '850px', margin: '30px auto' }}>
            
            {/* Top Dimension Line (Width) */}
            {showDimensions && (
              <div style={{ position: 'absolute', top: '-40px', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: currentTheme.dimLine, fontWeight: 'bold', marginBottom: '2px' }}>
                  W: {props.totalWidthM} m ({totalWidthMm} mm) - {props.resW} px
                </div>
                <div style={{ width: '100%', borderBottom: `1.5px dashed ${currentTheme.dimLine}`, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: '-5px', width: '2px', height: '10px', background: currentTheme.dimLine }} />
                  <div style={{ position: 'absolute', right: 0, top: '-5px', width: '2px', height: '10px', background: currentTheme.dimLine }} />
                </div>
              </div>
            )}

            {/* Right Dimension Line (Height) */}
            {showDimensions && (
              <div style={{ position: 'absolute', right: '-130px', top: 0, bottom: 0, width: '110px', display: 'flex', alignItems: 'center' }}>
                <div style={{ height: '100%', borderRight: `1.5px dashed ${currentTheme.dimLine}`, position: 'relative', marginRight: '10px' }}>
                  <div style={{ position: 'absolute', top: 0, right: '-5px', width: '10px', height: '2px', background: currentTheme.dimLine }} />
                  <div style={{ position: 'absolute', bottom: 0, right: '-5px', width: '10px', height: '2px', background: currentTheme.dimLine }} />
                </div>
                <div style={{ fontSize: '0.8rem', color: currentTheme.dimLine, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  H: {props.totalHeightM} m <br/>
                  ({totalHeightMm} mm) <br/>
                  {props.resH} px
                </div>
              </div>
            )}

            {/* Screen Grid Container */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${props.widthCols}, 1fr)`,
              width: '100%',
              aspectRatio: `${props.totalWidthM} / ${props.totalHeightM}`,
              background: currentTheme.gridFill,
              border: `2px solid ${currentTheme.textMain}`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              
              {Array.from({ length: props.totalUnits }).map((_, idx) => {
                const col = (idx % props.widthCols) + 1;
                const row = Math.floor(idx / props.widthCols) + 1;
                
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      borderRight: `1px dashed ${currentTheme.gridBorder}`, 
                      borderBottom: `1px dashed ${currentTheme.gridBorder}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Front View Details */}
                    {viewMode === 'front' && (
                      <>
                        {showGridLabels && (
                          <span style={{ fontSize: '0.7rem', color: currentTheme.textMain, fontWeight: '600' }}>
                            C{col}R{row}
                          </span>
                        )}
                        <span style={{ fontSize: '0.6rem', color: currentTheme.textSub }}>
                          {unitWidthMm}x{unitHeightMm}
                        </span>
                      </>
                    )}

                    {/* Rear Wiring View Details */}
                    {viewMode === 'rear' && (
                      <>
                        <div style={{ 
                          width: '60%', 
                          height: '40%', 
                          background: currentTheme.cardColor, 
                          borderRadius: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '0.6rem',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                          RC-{idx + 1}
                        </div>

                        {showWiringLines && (
                          <div style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: currentTheme.dataCable }} />
                        )}
                      </>
                    )}
                  </div>
                );
              })}

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 02: TOP VIEW (Ultra-Slim 80mm Depth CAD Section & Stepped Callouts) */}
        {/* ------------------------------------------------------------------ */}
        {viewMode === 'top' && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '40px auto', width: '100%', maxWidth: '820px' }}>
            
            <svg viewBox="0 0 760 400" style={{ width: '100%', height: 'auto', background: 'transparent' }}>
              <defs>
                {/* 50x25 MS Tube Cross Hatch / Grid Line Pattern */}
                <pattern id="msTubeHatchTop" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="6" stroke={currentTheme.textMain} strokeWidth="0.8" opacity="0.5" />
                </pattern>
                
                <marker id="arrowTop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={currentTheme.textMain} />
                </marker>
              </defs>

              {/* TOP VIEW SECTION CONTAINER (X: 120 to 620 = 500px width, Total Ultra-Slim Depth: 24px) */}

              {/* 1. MS Tube 50x25mm (Rear Layer with Grid Lines - 8px depth) */}
              <rect x="120" y="140" width="500" height="8" fill="url(#msTubeHatchTop)" stroke={currentTheme.textMain} strokeWidth="1" />

              {/* 2. MS Tube 40x20mm (Subframe Layer - Clean Straight Line Open Tube - 6px depth) */}
              <rect x="120" y="148" width="500" height="6" fill={currentTheme.gridFill} stroke={currentTheme.textMain} strokeWidth="1" />
              {/* Straight Tube Spacer Lines */}
              {Array.from({ length: props.widthCols + 1 }).map((_, i) => (
                <line key={i} x1={120 + i * (500 / props.widthCols)} y1="148" x2={120 + i * (500 / props.widthCols)} y2="154" stroke={currentTheme.textMain} strokeWidth="0.8" />
              ))}

              {/* 3. Laser Cut GI Sheet 2mm (Distinct Blue Line - 2px depth) */}
              <rect x="120" y="154" width="500" height="2" fill="#2563eb" stroke="#38bdf8" strokeWidth="0.8" />

              {/* 4. Module Magnet Stud Pins (Mounted Flush to GI Sheet Side) */}
              {Array.from({ length: props.widthCols * 2 }).map((_, m) => {
                const studX = 120 + (m + 0.5) * (500 / (props.widthCols * 2));
                return (
                  <g key={m} transform={`translate(${studX}, 156)`}>
                    {/* Magnet body attached to GI Sheet */}
                    <rect x="-2.5" y="0" width="5" height="3" fill={currentTheme.magnetColor} stroke="#fff" strokeWidth="0.4" />
                    {/* Stud pin extending into Module back */}
                    <line x1="0" y1="3" x2="0" y2="6" stroke={currentTheme.textMain} strokeWidth="1" />
                  </g>
                );
              })}

              {/* 5. LED Modules (Front Facing Horizontal Array - Slim 8px depth) */}
              <rect x="120" y="162" width="500" height="8" fill={currentTheme.gridFill} stroke={currentTheme.textMain} strokeWidth="1" />
              {/* Individual Module Seam Lines & Column Index Labels */}
              {Array.from({ length: props.widthCols }).map((_, c) => (
                <g key={c}>
                  <line x1={120 + c * (500 / props.widthCols)} y1="162" x2={120 + c * (500 / props.widthCols)} y2="170" stroke={currentTheme.textMain} strokeWidth="1" />
                  <text x={120 + (c + 0.5) * (500 / props.widthCols)} y="180" fill={currentTheme.textMain} fontSize="8" textAnchor="middle" fontWeight="bold">
                    C{c + 1}
                  </text>
                </g>
              ))}

              {/* ------------------------------------------------------------ */}
              {/* GREEN OVERALL WIDTH DIMENSION LINE (Above Section) */}
              {/* ------------------------------------------------------------ */}
              <line x1="120" y1="90" x2="620" y2="90" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="120" y1="80" x2="120" y2="100" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="620" y1="80" x2="620" y2="100" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="113" y1="97" x2="127" y2="83" stroke="#22c55e" strokeWidth="2" />
              <line x1="613" y1="97" x2="627" y2="83" stroke="#22c55e" strokeWidth="2" />
              
              <text x="370" y="80" fill="#22c55e" fontSize="15" fontWeight="bold" textAnchor="middle">
                {totalWidthMm} mm ({props.totalWidthM} m)
              </text>

              {/* ------------------------------------------------------------ */}
              {/* THICKNESS / DEPTH MEASUREMENT LINE (80 mm Depth Callout) */}
              {/* ------------------------------------------------------------ */}
              <line x1="635" y1="140" x2="635" y2="170" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="628" y1="140" x2="642" y2="140" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="628" y1="170" x2="642" y2="170" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="648" y="158" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="start">
                80 mm Depth
              </text>

              {/* ------------------------------------------------------------ */}
              {/* STEPPED DOWN / STAGGERED LEADER CALLOUTS */}
              {/* ------------------------------------------------------------ */}

              {/* Stepped Leader 1: LED Module (Step 1 Y=220) */}
              <line x1="160" y1="215" x2="160" y2="171" stroke={currentTheme.textMain} strokeWidth="1" markerEnd="url(#arrowTop)" />
              <text x="160" y="232" textAnchor="middle" fill={currentTheme.textMain} fontSize="12.5" fontWeight="500">
                P{props.pitch} LED Module ({unitWidthMm}mm)
              </text>

              {/* Stepped Leader 2: GI Sheet 2mm (Step 2 Y=260) */}
              <line x1="300" y1="255" x2="300" y2="157" stroke={currentTheme.textMain} strokeWidth="1" markerEnd="url(#arrowTop)" />
              <text x="300" y="272" textAnchor="middle" fill={currentTheme.textMain} fontSize="12.5" fontWeight="500">
                Laser Cut GI Sheet 2mm
              </text>

              {/* Stepped Leader 3: MS Tube 40x20mm (Step 3 Y=300) */}
              <line x1="440" y1="295" x2="440" y2="152" stroke={currentTheme.textMain} strokeWidth="1" markerEnd="url(#arrowTop)" />
              <text x="440" y="312" textAnchor="middle" fill={currentTheme.textMain} fontSize="12.5" fontWeight="500">
                MS Tube 40x20mm
              </text>

              {/* Stepped Leader 4: MS Tube 50x25mm (Step 4 Y=340) */}
              <line x1="570" y1="335" x2="570" y2="145" stroke={currentTheme.textMain} strokeWidth="1" markerEnd="url(#arrowTop)" />
              <text x="570" y="352" textAnchor="middle" fill={currentTheme.textMain} fontSize="12.5" fontWeight="500">
                MS Tube 50x25mm
              </text>

              {/* Module Count Header */}
              <text x="370" y="385" fill={currentTheme.textSub} fontSize="12" textAnchor="middle" fontWeight="bold">
                02: TOP VIEW - TOTAL {props.widthCols} MODULE COLUMNS ({totalWidthMm} mm)
              </text>
            </svg>

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 03: SIDE VIEW (Ultra-Slim 80mm Depth CAD Section) */}
        {/* ------------------------------------------------------------------ */}
        {viewMode === 'side' && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '40px auto', width: '100%', maxWidth: '750px' }}>
            
            <svg viewBox="0 0 700 480" style={{ width: '100%', height: 'auto', background: 'transparent' }}>
              <defs>
                <pattern id="msTubeHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="6" stroke={currentTheme.textMain} strokeWidth="0.8" opacity="0.5" />
                </pattern>
                
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={currentTheme.textMain} />
                </marker>
              </defs>

              {/* SIDE VIEW SECTION CONTAINER (Ultra-Slim 24px Depth Stack) */}

              {/* 1. MS Tube 50x25mm (Rear Layer with Grid Hatch - 8px width) */}
              <rect x="440" y="30" width="8" height="400" fill="url(#msTubeHatch)" stroke={currentTheme.textMain} strokeWidth="1" />

              {/* 2. MS Tube 40x20mm (Subframe Layer - Clean Straight Line - 6px width) */}
              <rect x="448" y="30" width="6" height="400" fill={currentTheme.gridFill} stroke={currentTheme.textMain} strokeWidth="1" />
              {/* Horizontal Tube Spacer Lines */}
              {Array.from({ length: Math.min(props.heightRows + 1, 10) }).map((_, i) => (
                <line key={i} x1="448" y1={30 + i * (400 / Math.min(props.heightRows, 9))} x2="454" y2={30 + i * (400 / Math.min(props.heightRows, 9))} stroke={currentTheme.textMain} strokeWidth="0.8" />
              ))}

              {/* 3. Laser Cut GI Sheet 2mm (Distinct Blue Line - 2px width) */}
              <rect x="454" y="30" width="2" fill="#2563eb" height="400" stroke="#38bdf8" strokeWidth="0.8" />

              {/* 4. Module Magnet Stud Pins (Mounted Flush to GI Sheet Side) */}
              {Array.from({ length: props.heightRows * 2 }).map((_, m) => {
                const studY = 30 + (m + 0.5) * (400 / (props.heightRows * 2));
                return (
                  <g key={m} transform={`translate(456, ${studY})`}>
                    {/* Magnet Body flush against GI Sheet */}
                    <rect x="0" y="-2" width="3" height="4" fill={currentTheme.magnetColor} stroke="#fff" strokeWidth="0.4" />
                    {/* Stud pin extending into Module back */}
                    <line x1="3" y1="0" x2="6" y2="0" stroke={currentTheme.textMain} strokeWidth="1" />
                  </g>
                );
              })}

              {/* 5. LED Modules (Front Facing Vertical Array - 8px width) */}
              <rect x="462" y="30" width="8" height="400" fill={currentTheme.gridFill} stroke={currentTheme.textMain} strokeWidth="1" />
              {/* Individual Module Seam Lines */}
              {Array.from({ length: props.heightRows }).map((_, r) => {
                const modY = 30 + r * (400 / props.heightRows);
                return (
                  <g key={r}>
                    <line x1="462" y1={modY} x2="470" y2={modY} stroke={currentTheme.textMain} strokeWidth="1" />
                  </g>
                );
              })}

              {/* ------------------------------------------------------------ */}
              {/* LEADER LINES & TEXT ANNOTATIONS */}
              {/* ------------------------------------------------------------ */}

              {/* Leader Line 1: LED Module */}
              <line x1="390" y1="100" x2="465" y2="100" stroke={currentTheme.textMain} strokeWidth="1" markerEnd="url(#arrow)" />
              <text x="380" y="104" textAnchor="end" fill={currentTheme.textMain} fontSize="15" fontWeight="500">
                P{props.pitch} Pixel LED Module
              </text>

              {/* Leader Line 2: GI Sheet 2mm */}
              <line x1="390" y1="180" x2="455" y2="180" stroke={currentTheme.textMain} strokeWidth="1" markerEnd="url(#arrow)" />
              <text x="380" y="184" textAnchor="end" fill={currentTheme.textMain} fontSize="15" fontWeight="500">
                Laser Cut GI Sheet 2mm
              </text>

              {/* Leader Line 3: MS Tube 40x20mm */}
              <line x1="390" y1="260" x2="450" y2="260" stroke={currentTheme.textMain} strokeWidth="1" markerEnd="url(#arrow)" />
              <text x="380" y="264" textAnchor="end" fill={currentTheme.textMain} fontSize="15" fontWeight="500">
                MS Tube 40x20mm
              </text>

              {/* Leader Line 4: MS Tube 50x25mm */}
              <line x1="390" y1="340" x2="442" y2="340" stroke={currentTheme.textMain} strokeWidth="1" markerEnd="url(#arrow)" />
              <text x="380" y="344" textAnchor="end" fill={currentTheme.textMain} fontSize="15" fontWeight="500">
                MS Tube 50x25mm
              </text>

              {/* ------------------------------------------------------------ */}
              {/* GREEN OVERALL HEIGHT DIMENSION LINE (Right Side) */}
              {/* ------------------------------------------------------------ */}
              <line x1="495" y1="30" x2="495" y2="430" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="487" y1="30" x2="503" y2="30" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="487" y1="430" x2="503" y2="430" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="489" y1="37" x2="501" y2="23" stroke="#22c55e" strokeWidth="2" />
              <line x1="489" y1="437" x2="501" y2="423" stroke="#22c55e" strokeWidth="2" />

              <text x="512" y="230" fill="#22c55e" fontSize="15" fontWeight="bold" transform="rotate(90 512 230)" textAnchor="middle">
                {totalHeightMm} mm (Exact {props.heightRows} Modules)
              </text>

              {/* ------------------------------------------------------------ */}
              {/* THICKNESS / DEPTH MEASUREMENT LINE (80 mm Depth Callout) */}
              {/* ------------------------------------------------------------ */}
              <line x1="440" y1="450" x2="470" y2="450" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="440" y1="443" x2="440" y2="457" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="470" y1="443" x2="470" y2="457" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="455" y="470" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                80 mm Depth
              </text>

            </svg>

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* CAD TITLE BLOCK (Same Official Title Block format) */}
        {/* ------------------------------------------------------------------ */}
        <div style={{ 
          width: '100%', 
          maxWidth: '850px', 
          marginTop: '25px', 
          border: `1.5px solid ${currentTheme.textMain}`, 
          background: currentTheme.gridFill,
          padding: '12px 18px',
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1.5fr',
          gap: '15px',
          fontSize: '0.75rem',
          color: currentTheme.textMain
        }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px', color: currentTheme.textMain }}>HAWAII LED BLUEPRINT</div>
            <div style={{ color: currentTheme.textSub }}>Model: {props.brandName} ({props.sceneName})</div>
            <div style={{ color: currentTheme.textSub }}>Pitch: P{props.pitch} mm | Grid: {props.widthCols} Cols x {props.heightRows} Rows</div>
            <div style={{ color: currentTheme.textSub }}>Box Outer Size: {totalWidthMm + 2} x {totalHeightMm + 2} x 80mm</div>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>ELECTRICAL & STRUCTURE</div>
            <div style={{ color: currentTheme.textSub }}>Controller: {props.processor}</div>
            <div style={{ color: currentTheme.textSub }}>Power Supply: {props.powerSupply} ({props.powerMaxW}W Max)</div>
            <div style={{ color: currentTheme.textSub }}>Frame: GI Sheet 2mm + MS Tube 40x20 & 50x25mm</div>
          </div>
          <div style={{ borderLeft: `1px solid ${currentTheme.gridBorder}`, paddingLeft: '12px' }}>
            <div style={{ fontWeight: 'bold' }}>DRAWING NO: 4618</div>
            <div style={{ color: currentTheme.textSub }}>Date: 13/07/2026</div>
            <div style={{ color: currentTheme.textSub }}>Status: APPROVED PRODUCTION SPEC</div>
          </div>
        </div>

      </div>

    </div>
  );
};
