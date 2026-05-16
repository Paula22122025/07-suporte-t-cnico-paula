import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbuokaxctdqdetebmbki.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidW9rYXhjdGRxZGV0ZWJtYmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjA2MTYsImV4cCI6MjA5NDIzNjYxNn0.SUfUBZ8Hgrx0BN9ncCwccLuVQLBSxya6c1WDylIb4gU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const ticketData = {
    ticket_no: 9999,
    subject: "Teste RLS",
    category_id: "1984b34e-5742-4569-8a54-eb20b815b507",
    priority: "Baixa",
    status: "Pendente",
    description: "Teste via script"
  };

  const { data, error } = await supabase
    .from('tickets')
    .insert([ticketData])
    .select();

  if (error) {
    console.error('Erro de Insert:', error);
  } else {
    console.log('Insert Sucesso:', data);
    
    // Now try update
    const { data: updateData, error: updateError } = await supabase
      .from('tickets')
      .update({ status: 'Cancelado' })
      .eq('id', data[0].id)
      .select();
      
    if (updateError) {
      console.error('Erro de Update:', updateError);
    } else {
      console.log('Update Sucesso:', updateData);
    }
  }
}

testInsert();
