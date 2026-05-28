const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
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
    .from('applications')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Erro ao ler tabela applications:", error);
    process.exit(1);
  }

  if (data && data.length > 0) {
    console.log("Campos na tabela applications:", Object.keys(data[0]));
    console.log("Exemplo de registro:", data[0]);
  } else {
    console.log("Tabela applications está vazia ou não retornou registros.");
  }
}

run();
