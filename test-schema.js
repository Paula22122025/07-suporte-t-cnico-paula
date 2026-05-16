import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbuokaxctdqdetebmbki.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidW9rYXhjdGRxZGV0ZWJtYmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjA2MTYsImV4cCI6MjA5NDIzNjYxNn0.SUfUBZ8Hgrx0BN9ncCwccLuVQLBSxya6c1WDylIb4gU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('tickets').select('*').limit(1);
  if (error) {
    console.error('Error fetching tickets:', error);
  } else {
    console.log('Ticket columns:', Object.keys(data[0] || {}));
  }
}

checkSchema();
