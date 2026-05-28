const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mjvxtxtskxwqhnbcndcc.supabase.co'; // Fallback se não estiver no env
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.log('Chave do Supabase não encontrada. Vamos tentar ler de src/components/CompanyDashboard.tsx ou .env');
  // Se não achar, podemos ler as credenciais do package ou de outro lugar
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Erro ao consultar tabela:', error);
  } else {
    console.log('Campos disponíveis na tabela applications:', Object.keys(data[0] || {}));
    console.log('Dados do primeiro registro:', data[0]);
  }
}

run();
