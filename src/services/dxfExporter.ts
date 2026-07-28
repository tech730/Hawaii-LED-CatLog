export interface DXFExportParams {
  brandName: string;
  sceneName: string;
  pitch: string;
  widthCols: number;
  heightRows: number;
  unitWidthMm: number; // e.g. 500 or 320
  unitHeightMm: number; // e.g. 500 or 160
  totalWidthM: string;
  totalHeightM: string;
  resW: number;
  resH: number;
  totalUnits: number;
}

export function generateDXFContent(params: DXFExportParams): string {
  const {
    brandName,
    sceneName,
    pitch,
    widthCols,
    heightRows,
    unitWidthMm,
    unitHeightMm,
    totalWidthM,
    totalHeightM,
    resW,
    resH,
    totalUnits
  } = params;

  const totalWidthMm = widthCols * unitWidthMm;
  const totalHeightMm = heightRows * unitHeightMm;

  let dxf = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1009
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
70
6
0
LAYER
2
0
70
0
62
7
6
CONTINUOUS
0
LAYER
2
OUTLINE
70
0
62
5
6
CONTINUOUS
0
LAYER
2
MODULE_GRID
70
0
62
1
6
CONTINUOUS
0
LAYER
2
STRUCTURE_80MM
70
0
62
4
6
CONTINUOUS
0
LAYER
2
DIMENSIONS
70
0
62
3
6
CONTINUOUS
0
LAYER
2
TEXT
70
0
62
2
6
CONTINUOUS
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
`;

  // Helper to add rectangle polyline
  const addRect = (layer: string, x1: number, y1: number, x2: number, y2: number) => {
    dxf += `0
LINE
8
${layer}
10
${x1}
20
${y1}
30
0.0
11
${x2}
21
${y1}
31
0.0
0
LINE
8
${layer}
10
${x2}
20
${y1}
30
0.0
11
${x2}
21
${y2}
31
0.0
0
LINE
8
${layer}
10
${x2}
20
${y2}
30
0.0
11
${x1}
21
${y2}
31
0.0
0
LINE
8
${layer}
10
${x1}
20
${y2}
30
0.0
11
${x1}
21
${y1}
31
0.0
`;
  };

  // Helper to add Text
  const addText = (layer: string, x: number, y: number, height: number, text: string) => {
    dxf += `0
TEXT
8
${layer}
10
${x}
20
${y}
30
0.0
40
${height}
1
${text}
`;
  };

  // Helper to add line
  const addLine = (layer: string, x1: number, y1: number, x2: number, y2: number) => {
    dxf += `0
LINE
8
${layer}
10
${x1}
20
${y1}
30
0.0
11
${x2}
21
${y2}
31
0.0
`;
  };

  // 1. FRONT VIEW: Outer Screen Boundary
  addRect('OUTLINE', 0, 0, totalWidthMm, totalHeightMm);
  addText('TEXT', totalWidthMm / 2 - 150, -50, 40, '01: FRONT ELEVATION');

  // 2. FRONT VIEW: Module Grid
  for (let r = 0; r < heightRows; r++) {
    for (let c = 0; c < widthCols; c++) {
      const x1 = c * unitWidthMm;
      const y1 = r * unitHeightMm;
      const x2 = x1 + unitWidthMm;
      const y2 = y1 + unitHeightMm;
      addRect('MODULE_GRID', x1, y1, x2, y2);

      const label = `C${c + 1}R${r + 1}`;
      addText('TEXT', x1 + unitWidthMm / 4, y1 + unitHeightMm / 2, Math.min(unitWidthMm, unitHeightMm) * 0.1, label);
    }
  }

  // 3. TOP VIEW (80mm Depth Section) Positioned Above Front Elevation
  const topY1 = totalHeightMm + 250;
  const topY2 = topY1 + 80; // 80mm Depth
  addRect('OUTLINE', 0, topY1, totalWidthMm, topY2);
  addText('TEXT', totalWidthMm / 2 - 150, topY2 + 20, 35, '02: TOP VIEW (80mm DEPTH)');

  // 5-Layer Stack Lines in Top View
  addLine('STRUCTURE_80MM', 0, topY1 + 15, totalWidthMm, topY1 + 15); // LED Module Front (15mm)
  addLine('STRUCTURE_80MM', 0, topY1 + 17, totalWidthMm, topY1 + 17); // GI Sheet 2mm
  addLine('STRUCTURE_80MM', 0, topY1 + 37, totalWidthMm, topY1 + 37); // MS Tube 40x20mm
  addLine('STRUCTURE_80MM', 0, topY1 + 62, totalWidthMm, topY1 + 62); // MS Tube 50x25mm

  // 4. SIDE VIEW (80mm Depth Vertical Section) Positioned to Right of Front Elevation
  const sideX1 = totalWidthMm + 250;
  const sideX2 = sideX1 + 80; // 80mm Depth
  addRect('OUTLINE', sideX1, 0, sideX2, totalHeightMm);
  addText('TEXT', sideX1, -50, 35, '03: SIDE VIEW (80mm DEPTH)');

  // 5-Layer Stack Lines in Side View
  addLine('STRUCTURE_80MM', sideX1 + 15, 0, sideX1 + 15, totalHeightMm); // LED Module Front (15mm)
  addLine('STRUCTURE_80MM', sideX1 + 17, 0, sideX1 + 17, totalHeightMm); // GI Sheet 2mm
  addLine('STRUCTURE_80MM', sideX1 + 37, 0, sideX1 + 37, totalHeightMm); // MS Tube 40x20mm
  addLine('STRUCTURE_80MM', sideX1 + 62, 0, sideX1 + 62, totalHeightMm); // MS Tube 50x25mm

  // 5. Dimension Lines
  const dimOffset = 120;
  // Width Dim line top view
  addLine('DIMENSIONS', 0, topY2 + dimOffset, totalWidthMm, topY2 + dimOffset);
  addText('DIMENSIONS', totalWidthMm / 2 - 100, topY2 + dimOffset + 30, 40, `W: ${totalWidthMm} mm (${totalWidthM}m)`);

  // Height Dim line right of side view
  addLine('DIMENSIONS', sideX2 + dimOffset, 0, sideX2 + dimOffset, totalHeightMm);
  addText('DIMENSIONS', sideX2 + dimOffset + 30, totalHeightMm / 2, 40, `H: ${totalHeightMm} mm (${totalHeightM}m)`);

  // 6. Title Block
  const tbX = 0;
  const tbY = -400; // Place below screen
  const tbW = Math.max(totalWidthMm + 350, 1400);
  const tbH = 300;

  addRect('OUTLINE', tbX, tbY, tbX + tbW, tbY + tbH);
  addText('TEXT', tbX + 30, tbY + 220, 40, `HAWAII LED ARCHITECTURAL & STRUCTURAL DRAWING`);
  addText('TEXT', tbX + 30, tbY + 160, 30, `PROJECT: ${brandName} ${sceneName} (P${pitch}) | DRAWING NO: 4618`);
  addText('TEXT', tbX + 30, tbY + 100, 25, `SCREEN: ${totalWidthM}m (W) x ${totalHeightM}m (H) | DEPTH: 80mm | RES: ${resW} x ${resH} px`);
  addText('TEXT', tbX + 30, tbY + 40, 25, `FRAME: GI Sheet 2mm + MS Tube 40x20 & 50x25mm | UNITS: ${totalUnits} Pcs (${unitWidthMm}x${unitHeightMm}mm) | DATE: 13/07/2026`);

  dxf += `0
ENDSEC
0
EOF
`;

  return dxf;
}

export function downloadDXFFile(params: DXFExportParams, filename: string = 'hawaii-led-blueprint.dxf') {
  const content = generateDXFContent(params);
  const blob = new Blob([content], { type: 'application/dxf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
