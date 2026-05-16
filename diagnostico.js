import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbuokaxctdqdetebmbki.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidW9rYXhjdGRxZGV0ZWJtYmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjA2MTYsImV4cCI6MjA5NDIzNjYxNn0.SUfUBZ8Hgrx0BN9ncCwccLuVQLBSxya6c1WDylIb4gU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnostico() {
  console.log("=== DIAGNÓSTICO COMPLETO ===\n");
  console.log("URL conectada pelo código:", supabaseUrl);
  console.log("Referência do projeto:", supabaseUrl.split('//')[1].split('.')[0]);
  console.log("\nBuscando dados diretamente...\n");

  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro:", error);
  } else {
    console.log(`Total de chamados no banco: ${data.length}`);
    data.forEach(t => {
      console.log(`  - [${t.ticket_no}] ${t.subject} → STATUS: ${t.status}`);
    });
  }
}

diagnostico();
