import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://coawxdgaojgtelwtdkir.supabase.co';
const supabaseKey = 'sb_publishable_ytzSeVjhqC_ccEhiB07_FA_XZM7CX_o';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable() {
  const { data, error } = await supabase.rpc('get_table_info', { table_name: 'tickets' });
  // If RPC doesn't exist, we can try a hacky select
  const { data: cols, error: err2 } = await supabase.from('tickets').select('*').limit(0);
  console.log("Colunas via API:", err2 ? "Erro" : "Ok");
}
// I'll just use a safer approach: try to insert a test row to see if it works
async function testInsert() {
    const { error } = await supabase.from('tickets').insert([{ subject: 'Teste' }]);
    console.log("Resultado insert teste:", error ? error.message : "Sucesso");
}

testInsert();
