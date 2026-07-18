import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://opygyrrmtfvwwatxqhft.supabase.co'
const supabaseKey = 'sb_publishable_nFY3m45q59Q0_cgZ4lbztA_mUKq7Ls6'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.from('english_bible').select('*').limit(2)
  console.log(JSON.stringify(data, null, 2))
}
test()
