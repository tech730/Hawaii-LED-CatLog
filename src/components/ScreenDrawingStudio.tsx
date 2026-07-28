import React, { useState } from 'react';
import { Download, FileText, Layers } from 'lucide-react';
import { downloadDXFFile } from '../services/dxfExporter';
import { exportTechnicalDrawingPDF } from '../services/pdfDrawingExporter';

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

type ViewMode = 'front' | 'rear' | 'structure';
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
      frameColor: '#64748b'
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
      frameColor: '#4b5563'
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
      frameColor: '#94a3b8'
    }
  };

  const currentTheme = themeStyles[themeMode];

  // PDF Export Handler
  const handlePDFExport = async () => {
    setIsExporting(true);
    await exportTechnicalDrawingPDF({
      drawingElementId: 'technical-drawing-canvas-area',
      filename: `${props.brandName.replace(/\s+/g, '_')}_Drawing_P${props.pitch}_${props.totalWidthM}x${props.totalHeightM}m.pdf`,
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
    });
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
            Front Elevation
          </button>
          <button 
            onClick={() => setViewMode('rear')}
            style={{ padding: '6px 12px', fontSize: '0.8rem', background: viewMode === 'rear' ? '#38bdf8' : 'transparent', color: viewMode === 'rear' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            Rear Cabling Diagram
          </button>
          <button 
            onClick={() => setViewMode('structure')}
            style={{ padding: '6px 12px', fontSize: '0.8rem', background: viewMode === 'structure' ? '#38bdf8' : 'transparent', color: viewMode === 'structure' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            Structure & Stand
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
          minHeight: '520px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        
        {/* Drawing Title Header overlay for blueprint style */}
        <div style={{ position: 'absolute', top: '15px', left: '20px', fontSize: '0.75rem', color: currentTheme.textSub }}>
          <div style={{ fontWeight: 'bold', color: currentTheme.textMain }}>MODE: {viewMode.toUpperCase()} VIEW</div>
          <div>Unit Size: {unitWidthMm}mm x {unitHeightMm}mm | Scale: N.T.S</div>
        </div>

        {/* Human Scale Reference (Person silhouette) */}
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
              {/* Head */}
              <circle cx="12" cy="8" r="6" />
              {/* Body */}
              <line x1="12" y1="14" x2="12" y2="36" />
              {/* Arms */}
              <line x1="4" y1="20" x2="20" y2="20" />
              {/* Legs */}
              <line x1="12" y1="36" x2="6" y2="58" />
              <line x1="12" y1="36" x2="18" y2="58" />
            </svg>
            <span style={{ fontSize: '0.65rem', color: currentTheme.textSub, marginTop: '2px' }}>Human (1.75m)</span>
          </div>
        )}

        {/* Interactive Grid Canvas */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '850px', margin: '30px auto' }}>
          
          {/* Top Dimension Line (Width) */}
          {showDimensions && (
            <div style={{ position: 'absolute', top: '-40px', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: currentTheme.dimLine, fontWeight: 'bold', marginBottom: '2px' }}>
                W: {props.totalWidthM} m ({unitWidthMm * props.widthCols} mm) - {props.resW} px
              </div>
              <div style={{ width: '100%', borderBottom: `1.5px dashed ${currentTheme.dimLine}`, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: '-5px', width: '2px', height: '10px', background: currentTheme.dimLine }} />
                <div style={{ position: 'absolute', right: 0, top: '-5px', width: '2px', height: '10px', background: currentTheme.dimLine }} />
              </div>
            </div>
          )}

          {/* Right Dimension Line (Height) */}
          {showDimensions && (
            <div style={{ position: 'absolute', right: '-120px', top: 0, bottom: 0, width: '100px', display: 'flex', alignItems: 'center' }}>
              <div style={{ height: '100%', borderRight: `1.5px dashed ${currentTheme.dimLine}`, position: 'relative', marginRight: '10px' }}>
                <div style={{ position: 'absolute', top: 0, right: '-5px', width: '10px', height: '2px', background: currentTheme.dimLine }} />
                <div style={{ position: 'absolute', bottom: 0, right: '-5px', width: '10px', height: '2px', background: currentTheme.dimLine }} />
              </div>
              <div style={{ fontSize: '0.8rem', color: currentTheme.dimLine, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                H: {props.totalHeightM} m <br/>
                ({unitHeightMm * props.heightRows} mm) <br/>
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
                  {/* Front Elevation View Details */}
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

                  {/* Rear Wiring Diagram View Details */}
                  {viewMode === 'rear' && (
                    <>
                      {/* Receiver Card Box */}
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

                      {/* Cabling Loop indicators */}
                      {showWiringLines && (
                        <div style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: currentTheme.dataCable }} />
                      )}
                    </>
                  )}

                  {/* Structural View Details */}
                  {viewMode === 'structure' && (
                    <div style={{ border: `1px stroke ${currentTheme.frameColor}`, width: '90%', height: '90%', opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.6rem', color: currentTheme.frameColor }}>BEAM</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Rear View Data Cabling Daisy-Chain Line SVG Overlay */}
            {viewMode === 'rear' && showWiringLines && (
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path 
                  d={`M 20 20 L ${props.widthCols * 40} 20`} 
                  stroke={currentTheme.dataCable} 
                  strokeWidth="2" 
                  strokeDasharray="4 4" 
                  fill="none" 
                />
              </svg>
            )}

          </div>

          {/* Bottom Stand / Truss Mount Bar (Structural view) */}
          {viewMode === 'structure' && (
            <div style={{ width: '100%', height: '30px', marginTop: '10px', background: currentTheme.frameColor, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold' }}>
              MAIN STEEL SUPPORT BEAM & GROUND RIGGING MOUNT
            </div>
          )}

        </div>

        {/* CAD Title Block (Bottom Footer of technical drawing) */}
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
          </div>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>ELECTRICAL & CONTROL</div>
            <div style={{ color: currentTheme.textSub }}>Controller: {props.processor}</div>
            <div style={{ color: currentTheme.textSub }}>Power Supply: {props.powerSupply} ({props.powerMaxW}W Max)</div>
          </div>
          <div style={{ borderLeft: `1px solid ${currentTheme.gridBorder}`, paddingLeft: '12px' }}>
            <div style={{ fontWeight: 'bold' }}>DRAWING NO: HW-{Date.now().toString().slice(-5)}</div>
            <div style={{ color: currentTheme.textSub }}>Date: {new Date().toLocaleDateString()}</div>
            <div style={{ color: currentTheme.textSub }}>Status: APPROVED</div>
          </div>
        </div>

      </div>

    </div>
  );
};
