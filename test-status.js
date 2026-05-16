import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbuokaxctdqdetebmbki.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidW9rYXhjdGRxZGV0ZWJtYmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjA2MTYsImV4cCI6MjA5NDIzNjYxNn0.SUfUBZ8Hgrx0BN9ncCwccLuVQLBSxya6c1WDylIb4gU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testStatuses() {
  const statuses = [
    'Em Atendimento', 'Em andamento', 'Em Andamento', 'Cancelado', 
    'Fechado', 'Resolvido', 'Aberto', 'Concluído', 'Concluido'
  ];

  // Try inserting one ticket to use for updates
  const { data: ticket, error } = await supabase
    .from('tickets')
    .insert([{
      ticket_no: 8888,
      subject: "Teste Status",
      category_id: "1984b34e-5742-4569-8a54-eb20b815b507",
      priority: "Baixa",
      status: "Pendente"
    }])
    .select();

  if (error) {
    console.log("Failed to insert initial ticket");
    return;
  }

  const id = ticket[0].id;

  for (const status of statuses) {
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', id);
      
    if (updateError) {
      console.log(`❌ Status '${status}' failed`);
    } else {
      console.log(`✅ Status '${status}' allowed!`);
    }
  }
}

testStatuses();
