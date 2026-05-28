const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:/Users/paulo/.gemini/antigravity/brain/2e174d1e-e5db-4067-b3a7-d9958b6a646b/.system_generated/logs/transcript.jsonl';

async function readLogs() {
  if (!fs.existsSync(logPath)) {
    console.log('Arquivo de log não encontrado em:', logPath);
    return;
  }

  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    index++;
    try {
      const step = JSON.parse(line);
      // Procurar por chamadas de ferramenta que alteram CompanyDashboard.tsx ou CandidateDashboard.tsx
      if (step.tool_calls) {
        for (const tc of step.tool_calls) {
          if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
            const args = tc.args || {};
            const targetFile = args.TargetFile || args.targetFile || '';
            if (targetFile.includes('CompanyDashboard.tsx') || targetFile.includes('CandidateDashboard.tsx')) {
              console.log(`Step [${index}] - Type: ${step.type} - Tool: ${tc.name} - File: ${path.basename(targetFile)} - Description: ${args.Description || args.description || 'Sem descrição'}`);
            }
          }
        }
      }
    } catch (e) {
      // Ignorar erros de parse de linha
    }
  }
}

readLogs();
