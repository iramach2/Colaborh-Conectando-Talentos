const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ukxqctjmvrpejgjijtxe.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.error("VITE_SUPABASE_ANON_KEY não configurada no env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Erro ao ler tabela jobs:", error);
    process.exit(1);
  }

  if (data && data.length > 0) {
    console.log("COLUNAS DE JOBS:", Object.keys(data[0]));
    console.log("Exemplo de vaga:", data[0]);
  } else {
    console.log("Tabela jobs está vazia.");
  }
}

run();
