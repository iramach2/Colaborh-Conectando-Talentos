const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'CompanyDashboard.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('parseCandidatePhoneData') || line.includes('candidate_phone')) {
    console.log(`Linha ${idx + 1}: ${line.trim()}`);
  }
});
