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

type ViewMode = 'all' | 'front' | 'top' | 'side' | 'rear';
type ThemeMode = 'blueprint' | 'dark' | 'clean';

export const ScreenDrawingStudio: React.FC<ScreenDrawingProps> = (props) => {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
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

  // PDF Export Handler (Captures Single All-in-One File containing ALL 4 VIEWS)
  const handlePDFExport = async () => {
    setIsExporting(true);
    // If not in 'all' view, switch briefly to 'all' so capture includes all 4 views
    const prevMode = viewMode;
    if (viewMode !== 'all') {
      setViewMode('all');
      await new Promise(r => setTimeout(r, 100));
    }

    await exportTechnicalDrawingPDF({
      drawingElementId: 'technical-drawing-canvas-area',
      filename: `${props.brandName.replace(/\s+/g, '_')}_Blueprint_All_Views.pdf`,
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

    if (prevMode !== 'all') {
      setViewMode(prevMode);
    }
    setIsExporting(false);
  };

  // DXF CAD Export Handler (Includes ALL 4 VIEWS in single .dxf file)
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
    }, `${props.brandName.replace(/\s+/g, '_')}_CAD_All_4_Views.dxf`);
  };

  // PNG Export Handler (Single PNG image containing all 4 views)
  const handlePNGExport = async () => {
    const prevMode = viewMode;
    if (viewMode !== 'all') {
      setViewMode('all');
      await new Promise(r => setTimeout(r, 100));
    }

    const el = document.getElementById('technical-drawing-canvas-area');
    if (el) {
      const html2canvasModule = await import('html2canvas');
      const canvas = await html2canvasModule.default(el, { backgroundColor: currentTheme.bg, scale: 2 });
      const link = document.createElement('a');
      link.download = `${props.brandName}_All_4_Views_Blueprint.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    if (prevMode !== 'all') {
      setViewMode(prevMode);
    }
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
            onClick={() => setViewMode('all')}
            style={{ padding: '6px 14px', fontSize: '0.8rem', background: viewMode === 'all' ? '#0284c7' : 'transparent', color: viewMode === 'all' ? '#fff' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            All 4 Views (Single Sheet)
          </button>
          <button 
            onClick={() => setViewMode('front')}
            style={{ padding: '6px 10px', fontSize: '0.8rem', background: viewMode === 'front' ? '#38bdf8' : 'transparent', color: viewMode === 'front' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            01: Front
          </button>
          <button 
            onClick={() => setViewMode('top')}
            style={{ padding: '6px 10px', fontSize: '0.8rem', background: viewMode === 'top' ? '#38bdf8' : 'transparent', color: viewMode === 'top' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            02: Top
          </button>
          <button 
            onClick={() => setViewMode('side')}
            style={{ padding: '6px 10px', fontSize: '0.8rem', background: viewMode === 'side' ? '#38bdf8' : 'transparent', color: viewMode === 'side' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            03: Side
          </button>
          <button 
            onClick={() => setViewMode('rear')}
            style={{ padding: '6px 10px', fontSize: '0.8rem', background: viewMode === 'rear' ? '#38bdf8' : 'transparent', color: viewMode === 'rear' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
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

        {/* Primary Single File Download Buttons */}
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
            <FileText size={16} /> {isExporting ? 'Generating Single PDF...' : 'Download PDF (All 4 Views)'}
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
            <Download size={16} /> AutoCAD DXF (All Views)
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
            <Download size={16} /> PNG (All Views)
          </button>
        </div>
      </div>

      {/* Technical Drawing Canvas Area (Single File Capture Container) */}
      <div 
        id="technical-drawing-canvas-area" 
        style={{ 
          background: currentTheme.bg, 
          padding: '30px 40px 40px 40px', 
          position: 'relative', 
          minHeight: '600px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        
        {/* Drawing Title Overlay */}
        <div style={{ width: '100%', maxWidth: '950px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.75rem', color: currentTheme.textSub }}>
          <div style={{ fontWeight: 'bold', color: currentTheme.textMain, fontSize: '0.85rem' }}>
            HAWAII LED ARCHITECTURAL BLUEPRINT SHEET (ALL 4 VIEWS)
          </div>
          <div>Box Size: {totalWidthMm + 2}mm (W) x {totalHeightMm + 2}mm (H) x 80mm (D) | Scale: N.T.S</div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* VIEW MODE 'all': FULL ALL-IN-ONE SHEET (ALL 4 VIEWS ON SINGLE CANVAS) */}
        {/* ------------------------------------------------------------------ */}
        {viewMode === 'all' && (
          <div style={{ position: 'relative', width: '100%', maxWidth: '950px', margin: '10px auto' }}>
            
            <svg viewBox="0 0 950 680" style={{ width: '100%', height: 'auto', background: 'transparent' }}>
              <defs>
                <pattern id="msTubeHatchAll" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="6" stroke={currentTheme.textMain} strokeWidth="0.8" opacity="0.5" />
                </pattern>
                
                <marker id="arrowAll" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={currentTheme.textMain} />
                </marker>
              </defs>

              {/* ============================================================ */}
              {/* 02: TOP VIEW (RENDERED TOP CENTER) */}
              {/* ============================================================ */}
              <g transform="translate(100, 30)">
                <text x="250" y="20" fill={currentTheme.textMain} fontSize="13" fontWeight="bold" textAnchor="middle">
                  02: TOP VIEW (80mm DEPTH SECTION)
                </text>

                {/* Top Width Dimension Line */}
                <line x1="0" y1="35" x2="500" y2="35" stroke="#22c55e" strokeWidth="1.2" />
                <line x1="0" y1="28" x2="0" y2="42" stroke="#22c55e" strokeWidth="1.2" />
                <line x1="500" y1="28" x2="500" y2="42" stroke="#22c55e" strokeWidth="1.2" />
                <text x="250" y="30" fill="#22c55e" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {totalWidthMm} mm ({props.totalWidthM} m)
                </text>

                {/* 5-Layer Top View Section (24px slim depth) */}
                <rect x="0" y="48" width="500" height="8" fill="url(#msTubeHatchAll)" stroke={currentTheme.textMain} strokeWidth="1" />
                <rect x="0" y="56" width="500" height="6" fill={currentTheme.gridFill} stroke={currentTheme.textMain} strokeWidth="1" />
                <rect x="0" y="62" width="500" height="2" fill="#2563eb" stroke="#38bdf8" strokeWidth="0.8" />
                
                {/* Magnets */}
                {Array.from({ length: props.widthCols * 2 }).map((_, m) => (
                  <g key={m} transform={`translate(${(m + 0.5) * (500 / (props.widthCols * 2))}, 64)`}>
                    <rect x="-2" y="0" width="4" height="3" fill={currentTheme.magnetColor} stroke="#fff" strokeWidth="0.4" />
                    <line x1="0" y1="3" x2="0" y2="6" stroke={currentTheme.textMain} strokeWidth="1" />
                  </g>
                ))}
                
                {/* LED Modules */}
                <rect x="0" y="70" width="500" height="8" fill={currentTheme.gridFill} stroke={currentTheme.textMain} strokeWidth="1" />
                {Array.from({ length: props.widthCols }).map((_, c) => (
                  <line key={c} x1={c * (500 / props.widthCols)} y1="70" x2={c * (500 / props.widthCols)} y2="78" stroke={currentTheme.textMain} strokeWidth="1" />
                ))}

                {/* Depth dimension */}
                <line x1="515" y1="48" x2="515" y2="78" stroke="#38bdf8" strokeWidth="1.2" />
                <text x="522" y="66" fill="#38bdf8" fontSize="10" fontWeight="bold">80 mm</text>
              </g>

              {/* ============================================================ */}
              {/* 01: FRONT ELEVATION (RENDERED CENTER LEFT) */}
              {/* ============================================================ */}
              <g transform="translate(100, 140)">
                <text x="175" y="-10" fill={currentTheme.textMain} fontSize="13" fontWeight="bold" textAnchor="middle">
                  01: FRONT VIEW (MODULE GRID)
                </text>

                {/* Front Grid Rect (350px W x 250px H) */}
                <rect x="0" y="0" width="350" height="250" fill={currentTheme.gridFill} stroke={currentTheme.textMain} strokeWidth="1.5" />
                
                {/* Module Seams */}
                {Array.from({ length: props.widthCols }).map((_, c) => (
                  <line key={c} x1={c * (350 / props.widthCols)} y1="0" x2={c * (350 / props.widthCols)} y2="250" stroke={currentTheme.gridBorder} strokeDasharray="3 3" />
                ))}
                {Array.from({ length: props.heightRows }).map((_, r) => (
                  <line key={r} x1="0" y1={r * (250 / props.heightRows)} x2="350" y2={r * (250 / props.heightRows)} stroke={currentTheme.gridBorder} strokeDasharray="3 3" />
                ))}

                <text x="175" y="130" fill={currentTheme.textMain} fontSize="13" fontWeight="bold" textAnchor="middle">
                  {props.widthCols} Cols x {props.heightRows} Rows ({props.totalUnits} Units)
                </text>
              </g>

              {/* ============================================================ */}
              {/* 03: SIDE VIEW (RENDERED CENTER RIGHT) */}
              {/* ============================================================ */}
              <g transform="translate(500, 140)">
                <text x="60" y="-10" fill={currentTheme.textMain} fontSize="13" fontWeight="bold" textAnchor="middle">
                  03: SIDE VIEW
                </text>

                {/* Slim 24px Depth Stack */}
                <rect x="40" y="0" width="8" height="250" fill="url(#msTubeHatchAll)" stroke={currentTheme.textMain} strokeWidth="1" />
                <rect x="48" y="0" width="6" height="250" fill={currentTheme.gridFill} stroke={currentTheme.textMain} strokeWidth="1" />
                <rect x="54" y="0" width="2" height="250" fill="#2563eb" stroke="#38bdf8" strokeWidth="0.8" />
                
                {/* Magnet studs */}
                {Array.from({ length: Math.min(props.heightRows * 2, 16) }).map((_, m) => (
                  <g key={m} transform={`translate(56, ${8 + m * (234 / 16)})`}>
                    <rect x="0" y="-1.5" width="2.5" height="3" fill={currentTheme.magnetColor} />
                    <line x1="2.5" y1="0" x2="6" y2="0" stroke={currentTheme.textMain} strokeWidth="1" />
                  </g>
                ))}

                {/* Modules */}
                <rect x="62" y="0" width="8" height="250" fill={currentTheme.gridFill} stroke={currentTheme.textMain} strokeWidth="1" />
                {Array.from({ length: props.heightRows }).map((_, r) => (
                  <line key={r} x1="62" y1={r * (250 / props.heightRows)} x2="70" y2={r * (250 / props.heightRows)} stroke={currentTheme.textMain} strokeWidth="1" />
                ))}

                {/* Height Dimension Line */}
                <line x1="85" y1="0" x2="85" y2="250" stroke="#22c55e" strokeWidth="1.2" />
                <line x1="80" y1="0" x2="90" y2="0" stroke="#22c55e" strokeWidth="1.2" />
                <line x1="80" y1="250" x2="90" y2="250" stroke="#22c55e" strokeWidth="1.2" />
                <text x="96" y="130" fill="#22c55e" fontSize="11" fontWeight="bold" transform="rotate(90 96 130)" textAnchor="middle">
                  {totalHeightMm} mm
                </text>

                {/* Leader Callout Annotations */}
                <line x1="-30" y1="40" x2="65" y2="40" stroke={currentTheme.textMain} strokeWidth="0.8" markerEnd="url(#arrowAll)" />
                <text x="-35" y="43" fill={currentTheme.textMain} fontSize="10" textAnchor="end">P{props.pitch} LED Module</text>

                <line x1="-30" y1="90" x2="55" y2="90" stroke={currentTheme.textMain} strokeWidth="0.8" markerEnd="url(#arrowAll)" />
                <text x="-35" y="93" fill={currentTheme.textMain} fontSize="10" textAnchor="end">GI Sheet 2mm</text>

                <line x1="-30" y1="140" x2="50" y2="140" stroke={currentTheme.textMain} strokeWidth="0.8" markerEnd="url(#arrowAll)" />
                <text x="-35" y="143" fill={currentTheme.textMain} fontSize="10" textAnchor="end">MS Tube 40x20mm</text>

                <line x1="-30" y1="190" x2="44" y2="190" stroke={currentTheme.textMain} strokeWidth="0.8" markerEnd="url(#arrowAll)" />
                <text x="-35" y="193" fill={currentTheme.textMain} fontSize="10" textAnchor="end">MS Tube 50x25mm</text>
              </g>

              {/* ============================================================ */}
              {/* 04: REAR WIRING LOOP DIAGRAM (RENDERED FAR RIGHT) */}
              {/* ============================================================ */}
              <g transform="translate(670, 140)">
                <text x="100" y="-10" fill={currentTheme.textMain} fontSize="13" fontWeight="bold" textAnchor="middle">
                  04: WIRING LOOP (CAT6)
                </text>

                <rect x="0" y="0" width="200" height="250" fill={currentTheme.gridFill} stroke={currentTheme.textMain} strokeWidth="1.5" />
                
                {/* Receiver Cards */}
                {Array.from({ length: Math.min(props.totalUnits, 6) }).map((_, r) => {
                  const cardY = 20 + r * 38;
                  return (
                    <g key={r}>
                      <rect x="30" y={cardY} width="140" height="26" fill={currentTheme.cardColor} rx="3" />
                      <text x="100" y={cardY + 17} fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">
                        RECEIVER CARD #{r + 1}
                      </text>
                      <circle cx="155" cy={cardY + 13} r="4" fill={currentTheme.dataCable} />
                    </g>
                  );
                })}

                {/* Cabling Loop Dashed Arrow */}
                <path d="M 155 33 C 185 80, 185 150, 155 210" stroke={currentTheme.dataCable} strokeWidth="1.5" strokeDasharray="4 4" fill="none" markerEnd="url(#arrowAll)" />
              </g>

              {/* ============================================================ */}
              {/* OFFICIAL TITLE BLOCK (BOTTOM FOOTER) */}
              {/* ============================================================ */}
              <g transform="translate(40, 440)">
                <rect x="0" y="0" width="870" height="110" fill={currentTheme.gridFill} stroke={currentTheme.textMain} strokeWidth="1.5" />
                
                {/* Vertical Separators */}
                <line x1="320" y1="0" x2="320" y2="110" stroke={currentTheme.gridBorder} />
                <line x1="620" y1="0" x2="620" y2="110" stroke={currentTheme.gridBorder} />

                {/* Column 1: Client & Drawing Specs */}
                <text x="15" y="25" fill={currentTheme.textMain} fontSize="12" fontWeight="bold">HAWAII LED SCREEN SPECIFICATION</text>
                <text x="15" y="45" fill={currentTheme.textSub} fontSize="10">CLIENT: Al Dana Jewellery | PROJECT SITE: Doha</text>
                <text x="15" y="65" fill={currentTheme.textSub} fontSize="10">SCREEN: {totalWidthMm}mm (W) x {totalHeightMm}mm (H) | AREA: {props.totalArea} m²</text>
                <text x="15" y="85" fill={currentTheme.textSub} fontSize="10">ENCLOSURE BOX: {totalWidthMm + 2} x {totalHeightMm + 2} x 80mm | RES: {props.resW}x{props.resH} px</text>

                {/* Column 2: Material & Hardware Specs */}
                <text x="335" y="25" fill={currentTheme.textMain} fontSize="12" fontWeight="bold">MATERIAL & HARDWARE SPECIFICATIONS</text>
                <text x="335" y="45" fill={currentTheme.textSub} fontSize="10">FRAME: Laser Cut GI Sheet 2mm + MS Tube 40x20 & 50x25mm</text>
                <text x="335" y="65" fill={currentTheme.textSub} fontSize="10">CONTROLLER: {props.processor} | POWER: {props.powerSupply}</text>
                <text x="335" y="85" fill={currentTheme.textSub} fontSize="10">MAX POWER: {props.powerMaxW}W (~ {(Number(props.powerMaxW) / 230).toFixed(1)}A) | WEIGHT: ~ {props.totalWeightKg} kg</text>

                {/* Column 3: Drawing Approval */}
                <text x="635" y="25" fill={currentTheme.textMain} fontSize="11" fontWeight="bold">DRAWING NO: 4618</text>
                <text x="635" y="45" fill={currentTheme.textSub} fontSize="9.5">DRAWN BY: MUHAMMED SHAFI</text>
                <text x="635" y="65" fill={currentTheme.textSub} fontSize="9.5">CHECKED BY: HASANUL BANNA</text>
                <text x="635" y="85" fill={currentTheme.textSub} fontSize="9.5">DATE: 13/07/2026 | STATUS: APPROVED</text>
              </g>

            </svg>

          </div>
        )}

        {/* Individual single view renderers (if user switches tab to inspect single view) */}
        {viewMode === 'front' && (
          <div style={{ position: 'relative', width: '100%', maxWidth: '850px', margin: '30px auto' }}>
            <div style={{ fontSize: '0.9rem', color: currentTheme.textMain, fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
              01: FRONT ELEVATION VIEW ({totalWidthMm}mm x {totalHeightMm}mm)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${props.widthCols}, 1fr)`, width: '100%', aspectRatio: `${props.totalWidthM} / ${props.totalHeightM}`, background: currentTheme.gridFill, border: `2px solid ${currentTheme.textMain}` }}>
              {Array.from({ length: props.totalUnits }).map((_, idx) => (
                <div key={idx} style={{ borderRight: `1px dashed ${currentTheme.gridBorder}`, borderBottom: `1px dashed ${currentTheme.gridBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: currentTheme.textMain }}>
                  C{(idx % props.widthCols) + 1}R{Math.floor(idx / props.widthCols) + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'top' && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '30px auto', width: '100%', maxWidth: '820px' }}>
            <div style={{ fontSize: '0.9rem', color: currentTheme.textMain, fontWeight: 'bold', textAlign: 'center' }}>
              02: TOP VIEW (80mm Section - {totalWidthMm}mm Width)
            </div>
          </div>
        )}

        {viewMode === 'side' && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '30px auto', width: '100%', maxWidth: '750px' }}>
            <div style={{ fontSize: '0.9rem', color: currentTheme.textMain, fontWeight: 'bold', textAlign: 'center' }}>
              03: SIDE VIEW (80mm Section - {totalHeightMm}mm Height)
            </div>
          </div>
        )}

        {viewMode === 'rear' && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '30px auto', width: '100%', maxWidth: '750px' }}>
            <div style={{ fontSize: '0.9rem', color: currentTheme.textMain, fontWeight: 'bold', textAlign: 'center' }}>
              04: REAR WIRING LOOP (CAT6 Connectivity)
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
