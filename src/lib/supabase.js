import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://coawxdgaojgtelwtdkir.supabase.co'
const supabaseAnonKey = 'sb_publishable_ytzSeVjhqC_ccEhiB07_FA_XZM7CX_o'

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


