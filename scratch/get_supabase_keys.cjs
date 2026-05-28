const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

let supabaseUrl = '';
let supabaseAnonKey = '';

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlEnv = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.*)/);
  const keyEnv = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.*)/);
  if (urlEnv) supabaseUrl = urlEnv[1].trim();
  if (keyEnv) supabaseAnonKey = keyEnv[1].trim();
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase
    .from('applications')
    .select('id, created_at')
    .limit(1);
    
  if (error) {
    console.error('Erro:', error);
  } else {
    console.log('Campos de data disponíveis:', data[0]);
  }
}

run();
