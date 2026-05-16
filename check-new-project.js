import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://coawxdgaojgtelwtdkir.supabase.co';
const supabaseKey = 'sb_publishable_ytzSeVjhqC_ccEhiB07_FA_XZM7CX_o';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNewProject() {
  console.log("Verificando projeto novo...");
  const { data, error } = await supabase.from('tickets').select('*').limit(1);
  
  if (error) {
    if (error.code === '42P01') {
      console.log("ERRO: A tabela 'tickets' não existe no projeto novo.");
    } else {
      console.error("Erro inesperado:", error.message);
    }
  } else {
    console.log("SUCESSO: A tabela 'tickets' já existe.");
    console.log("Colunas encontradas:", Object.keys(data[0] || {}));
  }
}

checkNewProject();
