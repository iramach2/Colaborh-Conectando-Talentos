const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ukxqctjmvrpejgjijtxe.supabase.co';
const supabaseKey = 'sb_publishable_4frj0D9rapQMpW61vGY8Bg_5rDf4wLh'; // da env sem o rest/v1 se for URL base

// A url em .env tem "/rest/v1/", vamos limpar
const cleanUrl = 'https://ukxqctjmvrpejgjijtxe.supabase.co';

const supabase = createClient(cleanUrl, supabaseKey);

async function run() {
  console.log("Iniciando teste de diagnóstico do Supabase...");
  
  // 1. Buscar candidaturas
  const { data: apps, error: fetchError } = await supabase
    .from('applications')
    .select('*')
    .limit(3);
    
  if (fetchError) {
    console.error("Erro ao buscar candidaturas:", fetchError);
    return;
  }
  
  console.log(`Encontradas ${apps.length} candidaturas.`);
  if (apps.length === 0) {
    console.log("Nenhuma candidatura encontrada para testar.");
    return;
  }
  
  const app = apps[0];
  console.log("Candidatura para teste:", {
    id: app.id,
    job_id: app.job_id,
    status: app.status,
    candidate_name: app.candidate_name
  });
  
  // Testar update com status atual para ver se RLS ou algo impede
  console.log("\n1. Testando update com o mesmo status...");
  const { data: updateData1, error: updateError1 } = await supabase
    .from('applications')
    .update({ status: app.status })
    .eq('id', app.id)
    .select();
    
  if (updateError1) {
    console.error("Erro no update 1 (mesmo status):", updateError1);
  } else {
    console.log("Update 1 bem-sucedido:", updateData1);
  }

  // Testar update com um status comum (ex: 'Entrevista')
  console.log("\n2. Testando update para 'Entrevista'...");
  const { data: updateData2, error: updateError2 } = await supabase
    .from('applications')
    .update({ status: 'Entrevista' })
    .eq('id', app.id)
    .select();
    
  if (updateError2) {
    console.error("Erro no update 2 ('Entrevista'):", updateError2);
  } else {
    console.log("Update 2 bem-sucedido:", updateData2);
  }

  // Testar update com um status personalizado longo
  console.log("\n3. Testando update para status personalizado 'Teste Técnico Adicional'...");
  const { data: updateData3, error: updateError3 } = await supabase
    .from('applications')
    .update({ status: 'Teste Técnico Adicional' })
    .eq('id', app.id)
    .select();
    
  if (updateError3) {
    console.error("Erro no update 3 (personalizado):", updateError3);
  } else {
    console.log("Update 3 bem-sucedido:", updateData3);
  }
}

run();
