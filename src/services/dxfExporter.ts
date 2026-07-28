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
5
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

  // 1. Draw Outer Screen Boundary
  addRect('OUTLINE', 0, 0, totalWidthMm, totalHeightMm);

  // 2. Draw Module / Cabinet Grid
  for (let r = 0; r < heightRows; r++) {
    for (let c = 0; c < widthCols; c++) {
      const x1 = c * unitWidthMm;
      const y1 = r * unitHeightMm;
      const x2 = x1 + unitWidthMm;
      const y2 = y1 + unitHeightMm;
      addRect('MODULE_GRID', x1, y1, x2, y2);

      // Add small module index text inside grid
      const textX = x1 + unitWidthMm / 4;
      const textY = y1 + unitHeightMm / 2;
      const label = `C${c + 1}R${r + 1}`;
      addText('TEXT', textX, textY, Math.min(unitWidthMm, unitHeightMm) * 0.1, label);
    }
  }

  // 3. Dimension Lines
  const dimOffset = 150; // 150mm offset for dim lines
  // Width Dim line top
  addLine('DIMENSIONS', 0, totalHeightMm + dimOffset, totalWidthMm, totalHeightMm + dimOffset);
  addLine('DIMENSIONS', 0, totalHeightMm + 20, 0, totalHeightMm + dimOffset + 30);
  addLine('DIMENSIONS', totalWidthMm, totalHeightMm + 20, totalWidthMm, totalHeightMm + dimOffset + 30);
  addText('DIMENSIONS', totalWidthMm / 2 - 100, totalHeightMm + dimOffset + 40, 50, `W: ${totalWidthMm} mm (${totalWidthM}m)`);

  // Height Dim line right
  addLine('DIMENSIONS', totalWidthMm + dimOffset, 0, totalWidthMm + dimOffset, totalHeightMm);
  addLine('DIMENSIONS', totalWidthMm + 20, 0, totalWidthMm + dimOffset + 30, 0);
  addLine('DIMENSIONS', totalWidthMm + 20, totalHeightMm, totalWidthMm + dimOffset + 30, totalHeightMm);
  addText('DIMENSIONS', totalWidthMm + dimOffset + 40, totalHeightMm / 2, 50, `H: ${totalHeightMm} mm (${totalHeightM}m)`);

  // 4. Title Block
  const tbX = 0;
  const tbY = -400; // Place below screen
  const tbW = Math.max(totalWidthMm, 1200);
  const tbH = 300;

  addRect('OUTLINE', tbX, tbY, tbX + tbW, tbY + tbH);
  addText('TEXT', tbX + 30, tbY + 220, 40, `HAWAII LED ARCHITECTURAL DRAWING`);
  addText('TEXT', tbX + 30, tbY + 160, 30, `PROJECT: ${brandName} ${sceneName} (P${pitch})`);
  addText('TEXT', tbX + 30, tbY + 100, 25, `SCREEN SIZE: ${totalWidthM}m (W) x ${totalHeightM}m (H) | RES: ${resW} x ${resH} px`);
  addText('TEXT', tbX + 30, tbY + 40, 25, `UNITS: ${widthCols}x${heightRows} (${totalUnits} Pcs @ ${unitWidthMm}x${unitHeightMm}mm) | DATE: ${new Date().toLocaleDateString()}`);

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
