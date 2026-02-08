
import { SUPABASE_KEY, SUPABASE_URL } from '../../../secrets'
import { createClient } from '@supabase/supabase-js'

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

