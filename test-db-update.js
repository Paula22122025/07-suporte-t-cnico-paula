import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbuokaxctdqdetebmbki.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidW9rYXhjdGRxZGV0ZWJtYmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjA2MTYsImV4cCI6MjA5NDIzNjYxNn0.SUfUBZ8Hgrx0BN9ncCwccLuVQLBSxya6c1WDylIb4gU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testarAtualizacaoBanco() {
  console.log("⏳ Iniciando teste do banco de dados...");
  
  // 1. Criar um chamado falso para o teste
  const { data: ticket, error: insertError } = await supabase
    .from('tickets')
    .insert([{
      ticket_no: 7777,
      subject: "Teste de Cancelamento",
      category_id: "1984b34e-5742-4569-8a54-eb20b815b507", // Informática/TI
      priority: "Baixa",
      status: "Pendente"
    }])
    .select();

  if (insertError) {
    console.error("❌ Falha na etapa 1 (Inserir chamado):", insertError.message);
    return;
  }
  
  const id = ticket[0].id;
  console.log("✅ Etapa 1: Chamado teste inserido com sucesso (ID: " + id + ")");

  // 2. Tentar atualizar para 'Cancelado'
  console.log("⏳ Tentando atualizar o status para 'Cancelado'...");
  const { error: updateError } = await supabase
    .from('tickets')
    .update({ status: 'Cancelado' })
    .eq('id', id);
    
  if (updateError) {
    console.error("❌ ERRO! O banco ainda não aceita o status 'Cancelado'.");
    console.error("Mensagem técnica do banco:", updateError.message);
    console.log("⚠️ Verifique se você executou o código SQL no painel do Supabase corretamente.");
  } else {
    console.log("🎉 SUCESSO! O banco foi atualizado corretamente e agora aceita o status 'Cancelado'!");
  }
  
  // 3. Limpar o teste (deletar o chamado criado)
  await supabase.from('tickets').delete().eq('id', id);
  console.log("🧹 Teste finalizado. Registro de teste removido.");
}

testarAtualizacaoBanco();
