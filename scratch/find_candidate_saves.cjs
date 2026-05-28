const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'CandidateDashboard.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('===DISC===') || line.includes('===MBTI===') || line.includes('===TEMPERAMENTOS===') || line.includes('COMPLETED===')) {
    console.log(`Linha ${idx + 1}: ${line.trim()}`);
  }
});
