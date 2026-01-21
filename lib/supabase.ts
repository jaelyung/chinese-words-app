import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 중국어 단어 타입 정의
export type ChineseWord = {
  id: number
  created_at: string
  simplified: string
  traditional: string
  pinyin: string
  meaning: string
  hsk_level: number
}

// 모든 단어 가져오기
export async function getWords() {
  const { data, error } = await supabase
    .from('chinese_words')
    .select('*')
    .order('hsk_level', { ascending: true })
  
  if (error) {
    console.error('Error fetching words:', error)
    return []
  }
  
  return data as ChineseWord[]
}