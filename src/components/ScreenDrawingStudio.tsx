import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
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
  receivingCardModel?: string;
  receivingCardMaxW?: number;
  receivingCardMaxH?: number;
  powerSupplyQty?: number;
}

type ViewMode = 'front' | 'top' | 'side' | 'data' | 'power';
type ThemeMode = 'blueprint' | 'dark' | 'clean';

export const ScreenDrawingStudio: React.FC<ScreenDrawingProps> = (props) => {
  const [viewMode, setViewMode] = useState<ViewMode>('front');
  const [themeMode, setThemeMode] = useState<ThemeMode>('blueprint');
  const [showDimensions] = useState(true);
  const [showGridLabels] = useState(true);
  const [showHumanScale] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Exact millimeter calculations
  const totalWidthMm = Math.round(Number(props.totalWidthM) * 1000);
  const totalHeightMm = Math.round(Number(props.totalHeightM) * 1000);
  const unitWidthMm = Math.round(props.unitW * 1000);
  const unitHeightMm = Math.round(props.unitH * 1000);

  // Themes palette
  const themeStyles = {
    blueprint: {
      bg: '#0f172a',
      gridBorder: '#38bdf8',
      gridFill: '#1e293b',
      textMain: '#f8fafc',
      textSub: '#94a3b8',
      dimLine: '#22c55e',
      dataCable: '#ef4444',
      powerCable: '#f59e0b',
      cardColor: '#10b981',
      frameColor: '#64748b',
      giSheet: '#2563eb',
      msTube40: '#f59e0b',
      msTube50: '#d946ef',
      magnetColor: '#ef4444'
    },
    dark: {
      bg: '#050505',
      gridBorder: '#333333',
      gridFill: '#111111',
      textMain: '#ffffff',
      textSub: '#888888',
      dimLine: '#10b981',
      dataCable: '#ff4d4d',
      powerCable: '#ffb84d',
      cardColor: '#059669',
      frameColor: '#444444',
      giSheet: '#2563eb',
      msTube40: '#f59e0b',
      msTube50: '#c026d3',
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

  // PDF Export Handler (Captures Pre-rendered Views for 100% Complete 4-Page PDF)
  const handlePDFExport = async () => {
    setIsExporting(true);

    await exportMultiPageTechnicalDrawingPDF(
      {
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
          powerMaxW: props.powerMaxW,
          receivingCardQty: props.receivingCardQty,
          receivingCardModel: props.receivingCardModel
        }
      },
      [
        { title: '01: Front Elevation', elementId: 'export-view-front' },
        { title: '02: Top View (80mm Section)', elementId: 'export-view-top' },
        { title: '03: Side View (80mm Section)', elementId: 'export-view-side' },
        { title: '04: Data Signal Wiring Diagram', elementId: 'export-view-data' },
        { title: '05: Power Distribution Diagram', elementId: 'export-view-power' }
      ]
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
      unitWidthMm: unitWidthMm,
      unitHeightMm: unitHeightMm,
      totalWidthM: props.totalWidthM,
      totalHeightM: props.totalHeightM,
      resW: props.resW,
      resH: props.resH,
      totalUnits: props.totalUnits
    });
  };

  // ----------------------------------------------------------------------
  // VIEW RENDERERS (Reusable for UI & PDF Export)
  // ----------------------------------------------------------------------

  // 01: FRONT ELEVATION
  const renderFrontViewContent = (theme: typeof currentTheme, showLabels: boolean, showDims: boolean, showHuman: boolean) => (
    <div style={{ position: 'relative', width: '100%', maxWidth: '850px', margin: '30px auto' }}>
      {/* Top Dimension Line (Width) */}
      {showDims && (
        <div style={{ position: 'absolute', top: '-40px', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: theme.dimLine, fontWeight: 'bold', marginBottom: '2px' }}>
            W: {props.totalWidthM} m ({totalWidthMm} mm) - {props.resW} px
          </div>
          <div style={{ width: '100%', borderBottom: `1.5px dashed ${theme.dimLine}`, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: '-5px', width: '2px', height: '10px', background: theme.dimLine }} />
            <div style={{ position: 'absolute', right: 0, top: '-5px', width: '2px', height: '10px', background: theme.dimLine }} />
          </div>
        </div>
      )}

      {/* Right Dimension Line (Height) */}
      {showDims && (
        <div style={{ position: 'absolute', right: '-130px', top: 0, bottom: 0, width: '110px', display: 'flex', alignItems: 'center' }}>
          <div style={{ height: '100%', borderRight: `1.5px dashed ${theme.dimLine}`, position: 'relative', marginRight: '10px' }}>
            <div style={{ position: 'absolute', top: 0, right: '-5px', width: '10px', height: '2px', background: theme.dimLine }} />
            <div style={{ position: 'absolute', bottom: 0, right: '-5px', width: '10px', height: '2px', background: theme.dimLine }} />
          </div>
          <div style={{ fontSize: '0.8rem', color: theme.dimLine, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
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
        background: theme.gridFill,
        border: `2px solid ${theme.textMain}`,
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
                borderRight: `1px dashed ${theme.gridBorder}`, 
                borderBottom: `1px dashed ${theme.gridBorder}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {showLabels && (
                <span style={{ fontSize: '0.7rem', color: theme.textMain, fontWeight: '600' }}>
                  C{col}R{row}
                </span>
              )}
              <span style={{ fontSize: '0.6rem', color: theme.textSub }}>
                {unitWidthMm}x{unitHeightMm}
              </span>
            </div>
          );
        })}
      </div>

      {showHuman && (
        <div style={{ position: 'absolute', left: '-50px', bottom: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
          <svg width="24" height="60" viewBox="0 0 24 60" fill="none" stroke={theme.textSub} strokeWidth="1.5">
            <circle cx="12" cy="8" r="6" />
            <line x1="12" y1="14" x2="12" y2="36" />
            <line x1="4" y1="20" x2="20" y2="20" />
            <line x1="12" y1="36" x2="6" y2="58" />
            <line x1="12" y1="36" x2="18" y2="58" />
          </svg>
          <span style={{ fontSize: '0.65rem', color: theme.textSub }}>Human (1.75m)</span>
        </div>
      )}
    </div>
  );

  // 02: TOP VIEW (Ultra-Slim 80mm Depth Section)
  const renderTopViewContent = (theme: typeof currentTheme) => (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '30px auto', width: '100%', maxWidth: '820px' }}>
      <svg viewBox="0 0 760 400" style={{ width: '100%', height: 'auto', background: 'transparent' }}>
        <defs>
          <pattern id={`msTubeHatchTop_${theme.bg.replace('#','')}`} width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke={theme.textMain} strokeWidth="0.8" opacity="0.5" />
          </pattern>
          <marker id={`arrowTop_${theme.bg.replace('#','')}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.textMain} />
          </marker>
        </defs>

        {/* 1. MS Tube 50x25mm (Rear Layer) */}
        <rect x="120" y="140" width="500" height="8" fill={`url(#msTubeHatchTop_${theme.bg.replace('#','')})`} stroke={theme.textMain} strokeWidth="1" />

        {/* 2. MS Tube 40x20mm (Subframe Layer) */}
        <rect x="120" y="148" width="500" height="6" fill={theme.gridFill} stroke={theme.textMain} strokeWidth="1" />
        {Array.from({ length: props.widthCols + 1 }).map((_, i) => (
          <line key={i} x1={120 + i * (500 / props.widthCols)} y1="148" x2={120 + i * (500 / props.widthCols)} y2="154" stroke={theme.textMain} strokeWidth="0.8" />
        ))}

        {/* 3. GI Sheet 2mm */}
        <rect x="120" y="154" width="500" height="2" fill="#2563eb" stroke="#38bdf8" strokeWidth="0.8" />

        {/* 4. Module Magnet Stud Pins (GI Sheet Side Mount) */}
        {Array.from({ length: props.widthCols * 2 }).map((_, m) => {
          const studX = 120 + (m + 0.5) * (500 / (props.widthCols * 2));
          return (
            <g key={m} transform={`translate(${studX}, 156)`}>
              <rect x="-2.5" y="0" width="5" height="3" fill={theme.magnetColor} stroke="#fff" strokeWidth="0.4" />
              <line x1="0" y1="3" x2="0" y2="6" stroke={theme.textMain} strokeWidth="1" />
            </g>
          );
        })}

        {/* 5. LED Modules */}
        <rect x="120" y="162" width="500" height="8" fill={theme.gridFill} stroke={theme.textMain} strokeWidth="1" />
        {Array.from({ length: props.widthCols }).map((_, c) => (
          <g key={c}>
            <line x1={120 + c * (500 / props.widthCols)} y1="162" x2={120 + c * (500 / props.widthCols)} y2="170" stroke={theme.textMain} strokeWidth="1" />
            <text x={120 + (c + 0.5) * (500 / props.widthCols)} y="180" fill={theme.textMain} fontSize="8" textAnchor="middle" fontWeight="bold">
              C{c + 1}
            </text>
          </g>
        ))}

        {/* Width Dimension Line */}
        <line x1="120" y1="90" x2="620" y2="90" stroke="#22c55e" strokeWidth="1.5" />
        <line x1="120" y1="80" x2="120" y2="100" stroke="#22c55e" strokeWidth="1.5" />
        <line x1="620" y1="80" x2="620" y2="100" stroke="#22c55e" strokeWidth="1.5" />
        <line x1="113" y1="97" x2="127" y2="83" stroke="#22c55e" strokeWidth="2" />
        <line x1="613" y1="97" x2="627" y2="83" stroke="#22c55e" strokeWidth="2" />
        <text x="370" y="80" fill="#22c55e" fontSize="15" fontWeight="bold" textAnchor="middle">
          {totalWidthMm} mm ({props.totalWidthM} m)
        </text>

        {/* 80mm Depth Line */}
        <line x1="635" y1="140" x2="635" y2="170" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="628" y1="140" x2="642" y2="140" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="628" y1="170" x2="642" y2="170" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="648" y="158" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="start">
          80 mm Depth
        </text>

        {/* Stepped Leader Callouts */}
        <line x1="160" y1="215" x2="160" y2="171" stroke={theme.textMain} strokeWidth="1" markerEnd={`url(#arrowTop_${theme.bg.replace('#','')})`} />
        <text x="160" y="232" textAnchor="middle" fill={theme.textMain} fontSize="12.5" fontWeight="500">
          P{props.pitch} LED Module ({unitWidthMm}mm)
        </text>

        <line x1="300" y1="255" x2="300" y2="157" stroke={theme.textMain} strokeWidth="1" markerEnd={`url(#arrowTop_${theme.bg.replace('#','')})`} />
        <text x="300" y="272" textAnchor="middle" fill={theme.textMain} fontSize="12.5" fontWeight="500">
          Laser Cut GI Sheet 2mm
        </text>

        <line x1="440" y1="295" x2="440" y2="152" stroke={theme.textMain} strokeWidth="1" markerEnd={`url(#arrowTop_${theme.bg.replace('#','')})`} />
        <text x="440" y="312" textAnchor="middle" fill={theme.textMain} fontSize="12.5" fontWeight="500">
          MS Tube 40x20mm
        </text>

        <line x1="570" y1="335" x2="570" y2="145" stroke={theme.textMain} strokeWidth="1" markerEnd={`url(#arrowTop_${theme.bg.replace('#','')})`} />
        <text x="570" y="352" textAnchor="middle" fill={theme.textMain} fontSize="12.5" fontWeight="500">
          MS Tube 50x25mm
        </text>

        <text x="370" y="385" fill={theme.textSub} fontSize="12" textAnchor="middle" fontWeight="bold">
          02: TOP VIEW - TOTAL {props.widthCols} MODULE COLUMNS ({totalWidthMm} mm)
        </text>
      </svg>
    </div>
  );

  // 03: SIDE VIEW (Ultra-Slim 80mm Depth Section)
  const renderSideViewContent = (theme: typeof currentTheme) => (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '30px auto', width: '100%', maxWidth: '750px' }}>
      <svg viewBox="0 0 700 480" style={{ width: '100%', height: 'auto', background: 'transparent' }}>
        <defs>
          <pattern id={`msTubeHatchSide_${theme.bg.replace('#','')}`} width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke={theme.textMain} strokeWidth="0.8" opacity="0.5" />
          </pattern>
          <marker id={`arrowSide_${theme.bg.replace('#','')}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.textMain} />
          </marker>
        </defs>

        {/* 1. MS Tube 50x25mm */}
        <rect x="440" y="30" width="8" height="400" fill={`url(#msTubeHatchSide_${theme.bg.replace('#','')})`} stroke={theme.textMain} strokeWidth="1" />

        {/* 2. MS Tube 40x20mm */}
        <rect x="448" y="30" width="6" height="400" fill={theme.gridFill} stroke={theme.textMain} strokeWidth="1" />
        {Array.from({ length: Math.min(props.heightRows + 1, 10) }).map((_, i) => (
          <line key={i} x1="448" y1={30 + i * (400 / Math.min(props.heightRows, 9))} x2="454" y2={30 + i * (400 / Math.min(props.heightRows, 9))} stroke={theme.textMain} strokeWidth="0.8" />
        ))}

        {/* 3. GI Sheet 2mm */}
        <rect x="454" y="30" width="2" fill="#2563eb" height="400" stroke="#38bdf8" strokeWidth="0.8" />

        {/* 4. Module Magnet Stud Pins */}
        {Array.from({ length: props.heightRows * 2 }).map((_, m) => {
          const studY = 30 + (m + 0.5) * (400 / (props.heightRows * 2));
          return (
            <g key={m} transform={`translate(456, ${studY})`}>
              <rect x="0" y="-2" width="3" height="4" fill={theme.magnetColor} stroke="#fff" strokeWidth="0.4" />
              <line x1="3" y1="0" x2="6" y2="0" stroke={theme.textMain} strokeWidth="1" />
            </g>
          );
        })}

        {/* 5. LED Modules */}
        <rect x="462" y="30" width="8" height="400" fill={theme.gridFill} stroke={theme.textMain} strokeWidth="1" />
        {Array.from({ length: props.heightRows }).map((_, r) => {
          const modY = 30 + r * (400 / props.heightRows);
          return (
            <g key={r}>
              <line x1="462" y1={modY} x2="470" y2={modY} stroke={theme.textMain} strokeWidth="1" />
            </g>
          );
        })}

        {/* Leader Lines */}
        <line x1="390" y1="100" x2="465" y2="100" stroke={theme.textMain} strokeWidth="1" markerEnd={`url(#arrowSide_${theme.bg.replace('#','')})`} />
        <text x="380" y="104" textAnchor="end" fill={theme.textMain} fontSize="15" fontWeight="500">
          P{props.pitch} Pixel LED Module
        </text>

        <line x1="390" y1="180" x2="455" y2="180" stroke={theme.textMain} strokeWidth="1" markerEnd={`url(#arrowSide_${theme.bg.replace('#','')})`} />
        <text x="380" y="184" textAnchor="end" fill={theme.textMain} fontSize="15" fontWeight="500">
          Laser Cut GI Sheet 2mm
        </text>

        <line x1="390" y1="260" x2="450" y2="260" stroke={theme.textMain} strokeWidth="1" markerEnd={`url(#arrowSide_${theme.bg.replace('#','')})`} />
        <text x="380" y="264" textAnchor="end" fill={theme.textMain} fontSize="15" fontWeight="500">
          MS Tube 40x20mm
        </text>

        <line x1="390" y1="340" x2="442" y2="340" stroke={theme.textMain} strokeWidth="1" markerEnd={`url(#arrowSide_${theme.bg.replace('#','')})`} />
        <text x="380" y="344" textAnchor="end" fill={theme.textMain} fontSize="15" fontWeight="500">
          MS Tube 50x25mm
        </text>

        {/* Height Dimension Line */}
        <line x1="495" y1="30" x2="495" y2="430" stroke="#22c55e" strokeWidth="1.5" />
        <line x1="487" y1="30" x2="503" y2="30" stroke="#22c55e" strokeWidth="1.5" />
        <line x1="487" y1="430" x2="503" y2="430" stroke="#22c55e" strokeWidth="1.5" />
        <line x1="489" y1="37" x2="501" y2="23" stroke="#22c55e" strokeWidth="2" />
        <line x1="489" y1="437" x2="501" y2="423" stroke="#22c55e" strokeWidth="2" />
        <text x="512" y="230" fill="#22c55e" fontSize="15" fontWeight="bold" transform="rotate(90 512 230)" textAnchor="middle">
          {totalHeightMm} mm (Exact {props.heightRows} Modules)
        </text>

        {/* 80mm Depth Callout */}
        <line x1="440" y1="450" x2="470" y2="450" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="440" y1="443" x2="440" y2="457" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="470" y1="443" x2="470" y2="457" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="455" y="470" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
          80 mm Depth
        </text>
      </svg>
    </div>
  );

  // 04: DATA SIGNAL WIRING DIAGRAM (COLOR-CODED ZONES)
  const renderDataWiringContent = (theme: typeof currentTheme) => {
    const modResW = Math.round((props.unitW * 1000) / parseFloat(props.pitch));
    const modResH = Math.round((props.unitH * 1000) / parseFloat(props.pitch));

    const cardMaxW = props.receivingCardMaxW || 512;
    const cardMaxH = props.receivingCardMaxH || 512;

    const maxColsPerRC = Math.max(1, Math.floor(cardMaxW / modResW));
    const maxRowsPerRC = Math.max(1, Math.floor(cardMaxH / modResH));

    const rcColsCount = Math.ceil(props.widthCols / maxColsPerRC);
    const rcRowsCount = Math.ceil(props.heightRows / maxRowsPerRC);
    const totalRC = props.isRental ? props.totalUnits : (rcColsCount * rcRowsCount);

    const rcStartIndices = new Set<number>();
    const rcIndexMap = new Map<number, number>();
    let rcCounter = 1;

    for (let rBlock = 0; rBlock < rcRowsCount; rBlock++) {
      for (let cBlock = 0; cBlock < rcColsCount; cBlock++) {
        const startRow = rBlock * maxRowsPerRC;
        const startCol = cBlock * maxColsPerRC;
        const startIdx = startRow * props.widthCols + startCol;
        if (startIdx < props.totalUnits) {
          rcStartIndices.add(startIdx);
          rcIndexMap.set(startIdx, rcCounter++);
        }
      }
    }

    const rcModelName = props.receivingCardModel || 'Novastar';

    // Distinct Zone Palette for Receiving Card Coverage Areas
    const dataZoneColors = [
      { bg: 'rgba(16, 185, 129, 0.20)', border: '#10b981', badge: '#059669' }, // Emerald Green
      { bg: 'rgba(56, 189, 248, 0.20)', border: '#38bdf8', badge: '#0284c7' }, // Sky Blue
      { bg: 'rgba(168, 85, 247, 0.20)', border: '#a855f7', badge: '#7e22ce' }, // Purple
      { bg: 'rgba(245, 158, 11, 0.20)', border: '#f59e0b', badge: '#d97706' }, // Amber
      { bg: 'rgba(236, 72, 153, 0.20)', border: '#ec4899', badge: '#be185d' }, // Pink
      { bg: 'rgba(20, 184, 166, 0.20)', border: '#14b8a6', badge: '#0d9488' }, // Teal
      { bg: 'rgba(99, 102, 241, 0.20)', border: '#6366f1', badge: '#4338ca' }, // Indigo
      { bg: 'rgba(234, 179, 8, 0.20)', border: '#eab308', badge: '#ca8a04' }   // Yellow
    ];

    return (
      <div style={{ position: 'relative', width: '100%', maxWidth: '850px', margin: '30px auto' }}>
        {/* Header Banner */}
        <div style={{ textAlign: 'center', marginBottom: '15px', color: theme.dimLine, fontWeight: 'bold', fontSize: '0.82rem' }}>
          04: DATA SIGNAL WIRING DIAGRAM | RECEIVING CARDS ({rcModelName} - {cardMaxW}x{cardMaxH}px LIMIT): {totalRC} COLOR ZONES | MAX {maxColsPerRC} COLS PER CARD
        </div>

        {/* Screen Module Rear Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${props.widthCols}, 1fr)`,
          width: '100%',
          aspectRatio: `${props.totalWidthM} / ${props.totalHeightM}`,
          background: theme.gridFill,
          border: `2px solid ${theme.textMain}`,
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          position: 'relative'
        }}>
          {Array.from({ length: props.totalUnits }).map((_, idx) => {
            const col = (idx % props.widthCols) + 1;
            const row = Math.floor(idx / props.widthCols) + 1;

            // Determine RC Zone for this module
            const rBlock = Math.floor((row - 1) / maxRowsPerRC);
            const cBlock = Math.floor((col - 1) / maxColsPerRC);
            const rcZoneIdx = props.isRental ? idx : (rBlock * rcColsCount + cBlock);
            const zoneColor = dataZoneColors[rcZoneIdx % dataZoneColors.length];

            const isRCStart = rcStartIndices.has(idx);
            const rcNum = rcIndexMap.get(idx);

            return (
              <div 
                key={idx} 
                style={{ 
                  background: zoneColor.bg,
                  borderRight: `1px solid ${zoneColor.border}`, 
                  borderBottom: `1px solid ${zoneColor.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isRCStart ? (
                  <div style={{ 
                    width: '92%', 
                    height: '70%', 
                    background: zoneColor.badge, 
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '0.62rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.4)',
                    border: '1.5px solid #fff'
                  }}>
                    <span>RC-{rcNum}</span>
                    <span style={{ fontSize: '0.45rem', opacity: 0.95 }}>FEED (C{col}R{row})</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.9 }}>
                    <span style={{ fontSize: '0.6rem', color: theme.textMain, fontWeight: '600' }}>
                      C{col}R{row}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: zoneColor.border }} />
                      <span style={{ fontSize: '0.45rem', color: zoneColor.border, fontWeight: 'bold' }}>CAT6 LOOP→</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 05: POWER DISTRIBUTION DIAGRAM (COLOR-CODED 2D PSU ZONES - MAX 3 COLS WIDE x MAX 6 ROWS HIGH REACH)
  const renderPowerWiringContent = (theme: typeof currentTheme) => {
    const ampsMax = (Number(props.powerMaxW) / 230).toFixed(1);

    // Build PSU 2D Zones based on physical cable reach (Max 3 cols wide = 960mm, Max 6 rows high = 960mm, Max 10 mods per 60A PSU)
    const psuZoneMap = new Map<number, { psuNum: number; zoneIdx: number; isCenter: boolean }>();
    const psuColsCount = Math.ceil(props.widthCols / 3);
    
    let psuCounter = 1;

    for (let cBlock = 0; cBlock < psuColsCount; cBlock++) {
      const startCol = cBlock * 3;
      const blockW = Math.min(3, props.widthCols - startCol);
      const maxRowsForBlock = Math.min(6, Math.floor(10 / blockW));
      const psuRowsCount = Math.ceil(props.heightRows / maxRowsForBlock);

      for (let rBlock = 0; rBlock < psuRowsCount; rBlock++) {
        const startRow = rBlock * maxRowsForBlock;
        const blockH = Math.min(maxRowsForBlock, props.heightRows - startRow);
        const psuNum = psuCounter++;

        // Center module in this 2D PSU block
        const centerColInBlock = Math.floor(blockW / 2);
        const centerRowInBlock = Math.floor(blockH / 2);
        const centerIdx = (startRow + centerRowInBlock) * props.widthCols + (startCol + centerColInBlock);

        for (let r = 0; r < blockH; r++) {
          for (let c = 0; c < blockW; c++) {
            const idx = (startRow + r) * props.widthCols + (startCol + c);
            psuZoneMap.set(idx, {
              psuNum,
              zoneIdx: psuNum - 1,
              isCenter: idx === centerIdx
            });
          }
        }
      }
    }

    const totalPSU = psuCounter - 1;

    // Distinct Zone Palette for Power Supply Coverage Areas
    const powerZoneColors = [
      { bg: 'rgba(245, 158, 11, 0.22)', border: '#f59e0b', badge: '#d97706' }, // Gold / Amber
      { bg: 'rgba(239, 68, 68, 0.22)', border: '#ef4444', badge: '#dc2626' },   // Red
      { bg: 'rgba(59, 130, 246, 0.22)', border: '#3b82f6', badge: '#1d4ed8' },  // Blue
      { bg: 'rgba(34, 197, 94, 0.22)', border: '#22c55e', badge: '#15803d' },  // Green
      { bg: 'rgba(168, 85, 247, 0.22)', border: '#a855f7', badge: '#7e22ce' }, // Violet
      { bg: 'rgba(236, 72, 153, 0.22)', border: '#ec4899', badge: '#be185d' }, // Pink
      { bg: 'rgba(14, 165, 233, 0.22)', border: '#0ea5e9', badge: '#0369a1' }, // Cyan
      { bg: 'rgba(249, 115, 22, 0.22)', border: '#f97316', badge: '#c2410c' }  // Orange
    ];

    return (
      <div style={{ position: 'relative', width: '100%', maxWidth: '850px', margin: '30px auto' }}>
        {/* Header Banner */}
        <div style={{ textAlign: 'center', marginBottom: '15px', color: theme.powerCable, fontWeight: 'bold', fontSize: '0.82rem' }}>
          05: POWER DISTRIBUTION DIAGRAM | 60A 5V DC PSUs (MAX 3 COLS x 6 ROWS REACH): {totalPSU} COLOR ZONES | AC MAINS LOAD: ~ {ampsMax}A @ 230V ({props.powerMaxW}W MAX)
        </div>

        {/* Screen Module Rear Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${props.widthCols}, 1fr)`,
          width: '100%',
          aspectRatio: `${props.totalWidthM} / ${props.totalHeightM}`,
          background: theme.gridFill,
          border: `2px solid ${theme.textMain}`,
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          position: 'relative'
        }}>
          {Array.from({ length: props.totalUnits }).map((_, idx) => {
            const col = (idx % props.widthCols) + 1;
            const row = Math.floor(idx / props.widthCols) + 1;

            const psuInfo = psuZoneMap.get(idx) || { psuNum: 1, zoneIdx: 0, isCenter: false };
            const zoneColor = powerZoneColors[psuInfo.zoneIdx % powerZoneColors.length];

            return (
              <div 
                key={idx} 
                style={{ 
                  background: zoneColor.bg,
                  borderRight: `1px solid ${zoneColor.border}`, 
                  borderBottom: `1px solid ${zoneColor.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {psuInfo.isCenter ? (
                  <div style={{ 
                    width: '90%', 
                    height: '65%', 
                    background: zoneColor.badge, 
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '0.62rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                    border: '1.5px solid #fff'
                  }}>
                    <span>PSU-{psuInfo.psuNum}</span>
                    <span style={{ fontSize: '0.48rem', opacity: 0.95 }}>60A (5V DC)</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.9 }}>
                    <span style={{ fontSize: '0.6rem', color: theme.textMain, fontWeight: '600' }}>
                      C{col}R{row}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: zoneColor.border }} />
                      <span style={{ fontSize: '0.45rem', color: zoneColor.border, fontWeight: 'bold' }}>5V DC→</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Title Block Footer
  const renderTitleBlock = (theme: typeof currentTheme) => (
    <div style={{ 
      width: '100%', 
      maxWidth: '850px', 
      marginTop: '25px', 
      border: `1.5px solid ${theme.textMain}`, 
      background: theme.gridFill,
      padding: '12px 18px',
      display: 'grid',
      gridTemplateColumns: '2fr 2fr 1.5fr',
      gap: '15px',
      fontSize: '0.75rem',
      color: theme.textMain
    }}>
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px', color: theme.textMain }}>HAWAII LED BLUEPRINT</div>
        <div style={{ color: theme.textSub }}>Model: {props.brandName} ({props.sceneName})</div>
        <div style={{ color: theme.textSub }}>Pitch: P{props.pitch} mm | Grid: {props.widthCols} Cols x {props.heightRows} Rows</div>
        <div style={{ color: theme.textSub }}>Box Outer Size: {totalWidthMm + 2} x {totalHeightMm + 2} x 80mm</div>
      </div>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>ELECTRICAL & STRUCTURE</div>
        <div style={{ color: theme.textSub }}>Controller: {props.processor}</div>
        <div style={{ color: theme.textSub }}>Power Supply: {props.powerSupply} ({props.powerMaxW}W Max)</div>
        <div style={{ color: theme.textSub }}>Receiver Cards: {props.receivingCardQty} Units {props.receivingCardModel ? `(${props.receivingCardModel})` : ''}</div>
        <div style={{ color: theme.textSub }}>Frame: GI Sheet 2mm + MS Tube 40x20 & 50x25mm</div>
      </div>
      <div style={{ borderLeft: `1px solid ${theme.gridBorder}`, paddingLeft: '12px' }}>
        <div style={{ fontWeight: 'bold' }}>DRAWING NO: 4618</div>
        <div style={{ color: theme.textSub }}>Date: 13/07/2026</div>
        <div style={{ color: theme.textSub }}>Status: APPROVED PRODUCTION SPEC</div>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', background: currentTheme.bg, padding: '24px', borderRadius: '12px', minHeight: '650px' }}>
      
      {/* ------------------------------------------------------------------ */}
      {/* TOP STUDIO TOOLBAR & CONTROLS */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${currentTheme.gridBorder}` }}>
        
        {/* View Mode Tabs */}
        <div style={{ display: 'flex', background: currentTheme.gridFill, padding: '4px', borderRadius: '8px', border: `1px solid ${currentTheme.gridBorder}` }}>
          {[
            { id: 'front', label: '01: Front View' },
            { id: 'top', label: '02: Top View (80mm Section)' },
            { id: 'side', label: '03: Side View (80mm Section)' },
            { id: 'data', label: '04: Data Signal Wiring' },
            { id: 'power', label: '05: Power Cabling' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as ViewMode)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: viewMode === tab.id ? 'bold' : 'normal',
                background: viewMode === tab.id ? currentTheme.textMain : 'transparent',
                color: viewMode === tab.id ? currentTheme.bg : currentTheme.textSub,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Actions & Theme Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Theme Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: currentTheme.gridFill, padding: '3px', borderRadius: '6px', border: `1px solid ${currentTheme.gridBorder}` }}>
            {(['blueprint', 'dark', 'clean'] as ThemeMode[]).map((t) => (
              <button
                key={t}
                onClick={() => setThemeMode(t)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.75rem',
                  textTransform: 'capitalize',
                  background: themeMode === t ? currentTheme.textMain : 'transparent',
                  color: themeMode === t ? currentTheme.bg : currentTheme.textSub,
                  cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* DXF Exporter */}
          <button
            onClick={handleDXFExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '6px',
              border: `1px solid ${currentTheme.gridBorder}`,
              background: currentTheme.gridFill,
              color: currentTheme.textMain,
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <FileText size={15} />
            AutoCAD DXF
          </button>

          {/* PDF Exporter */}
          <button
            onClick={handlePDFExport}
            disabled={isExporting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: isExporting ? 'wait' : 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
            }}
          >
            <Download size={15} />
            {isExporting ? 'Generating PDF...' : 'Download PDF Drawing'}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* INTERACTIVE UI DRAWING CANVAS AREA */}
      {/* ------------------------------------------------------------------ */}
      <div id="technical-drawing-canvas-area" style={{ width: '100%', background: currentTheme.bg, padding: '20px', borderRadius: '8px' }}>
        
        {viewMode === 'front' && renderFrontViewContent(currentTheme, showGridLabels, showDimensions, showHumanScale)}
        {viewMode === 'top' && renderTopViewContent(currentTheme)}
        {viewMode === 'side' && renderSideViewContent(currentTheme)}
        {viewMode === 'data' && renderDataWiringContent(currentTheme)}
        {viewMode === 'power' && renderPowerWiringContent(currentTheme)}

        {/* CAD Title Block */}
        {renderTitleBlock(currentTheme)}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* HIDDEN OFFSCREEN EXPORT CONTAINER (Pre-renders all 5 views for 100% complete 5-Page PDF) */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '900px', pointerEvents: 'none' }}>
        <div id="export-view-front" style={{ width: '850px', background: currentTheme.bg, padding: '24px' }}>
          {renderFrontViewContent(currentTheme, true, true, false)}
          {renderTitleBlock(currentTheme)}
        </div>

        <div id="export-view-top" style={{ width: '850px', background: currentTheme.bg, padding: '24px' }}>
          {renderTopViewContent(currentTheme)}
          {renderTitleBlock(currentTheme)}
        </div>

        <div id="export-view-side" style={{ width: '850px', background: currentTheme.bg, padding: '24px' }}>
          {renderSideViewContent(currentTheme)}
          {renderTitleBlock(currentTheme)}
        </div>

        <div id="export-view-data" style={{ width: '850px', background: currentTheme.bg, padding: '24px' }}>
          {renderDataWiringContent(currentTheme)}
          {renderTitleBlock(currentTheme)}
        </div>

        <div id="export-view-power" style={{ width: '850px', background: currentTheme.bg, padding: '24px' }}>
          {renderPowerWiringContent(currentTheme)}
          {renderTitleBlock(currentTheme)}
        </div>
      </div>

    </div>
  );
};
