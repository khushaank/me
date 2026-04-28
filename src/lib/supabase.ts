import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hzxwqxmldlncrhqxlnlq.supabase.co'
const supabaseAnonKey = 'sb_publishable_B-oHA0Zpa5YMM_mrAaa-Bw_UpVKPtMZ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
