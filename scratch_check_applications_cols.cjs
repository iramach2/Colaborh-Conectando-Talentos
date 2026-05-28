const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Erro:", error.message);
    return;
  }

  if (data && data.length > 0) {
    console.log("COLUNAS:", Object.keys(data[0]).join(', '));
  } else {
    console.log("Sem registros em applications");
  }
}

run();
