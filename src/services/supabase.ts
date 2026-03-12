import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qdcjxsxgssohpqxugppa.supabase.co"
const supabaseKey = "sb_publishable_bKY8r1zajpT2bih2CgKm-A_LwkuB4kg"

export const supabase = createClient(supabaseUrl, supabaseKey)

