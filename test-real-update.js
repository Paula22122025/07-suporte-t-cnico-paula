import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbuokaxctdqdetebmbki.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidW9rYXhjdGRxZGV0ZWJtYmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjA2MTYsImV4cCI6MjA5NDIzNjYxNn0.SUfUBZ8Hgrx0BN9ncCwccLuVQLBSxya6c1WDylIb4gU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testarAtualizacaoReal() {
  console.log("Buscando chamados...");
  const { data: tickets, error: fetchError } = await supabase
    .from('tickets')
    .select('*')
    .limit(3);

  if (fetchError) {
    console.error("Erro ao buscar:", fetchError);
    return;
  }
  
  if (tickets.length === 0) {
    console.log("Nenhum chamado real encontrado no banco.");
    return;
  }

  const ticket = tickets[0];
  console.log(`Tentando atualizar o chamado ID: ${ticket.id}`);

  const { error: updateError } = await supabase
    .from('tickets')
    .update({ status: 'Concluído' })
    .eq('id', ticket.id)
    .select();

  if (updateError) {
    console.error("ERRO ao atualizar:", updateError);
  } else {
    console.log("SUCESSO! O banco atualizou o chamado real.");
  }
}

testarAtualizacaoReal();
