import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://opygyrrmtfvwwatxqhft.supabase.co'
const supabaseKey = 'sb_publishable_nFY3m45q59Q0_cgZ4lbztA_mUKq7Ls6'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const songs = await supabase.from('songs').select('*').limit(1)
  console.log("Songs:", songs.data)
  
  const tamil = await supabase.from('tamil_bible').select('*').limit(1)
  console.log("Tamil:", tamil.data)
  
  const english = await supabase.from('english_bible').select('*').limit(1)
  console.log("English:", english.data)
}
test()
