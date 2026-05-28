const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ukxqctjmvrpejgjijtxe.supabase.co';
const supabaseKey = 'sb_publishable_4frj0D9rapQMpW61vGY8Bg_5rDf4wLh';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== DIAGNÓSTICO DE RLS NO SUPABASE ===");
  
  // Executar query RPC ou SQL para ler as políticas de RLS
  // Como não temos acesso a SQL raw direto por RPC a menos que exista uma função,
  // vamos tentar ler de uma tabela de sistema se possível, ou apenas testar se um update simulado falha com RLS.
  // Mas no script node funcionou porque estamos usando a chave anon, que atua com a RLS da chave anon.
  // Vamos ver se o usuário no painel tem permissão.
  
  const { data, error } = await supabase
    .from('jobs')
    .select('id, title, company_name')
    .limit(1);
    
  if (error) {
    console.error("Erro ao ler vaga:", error);
    return;
  }
  
  console.log("Vaga lida com sucesso usando anon key:", data);
}

run();
