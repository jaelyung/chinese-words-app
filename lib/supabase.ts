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

// 로컬 스토리지에 단어 캐싱
export async function getWordsWithCache() {
  try {
    // 온라인이면 Supabase에서 가져오기
    if (typeof window !== 'undefined' && navigator.onLine) {
      const { data, error } = await supabase
        .from('chinese_words')
        .select('*')
        .order('hsk_level', { ascending: true })
      
      if (!error && data) {
        // 로컬 스토리지에 저장
        localStorage.setItem('cached_words', JSON.stringify(data))
        localStorage.setItem('cached_words_time', new Date().toISOString())
        return data as ChineseWord[]
      }
    }
    
    // 오프라인이거나 에러 발생 시 캐시에서 가져오기
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cached_words')
      if (cached) {
        return JSON.parse(cached) as ChineseWord[]
      }
    }
    
    return []
  } catch (error) {
    console.error('Error fetching words:', error)
    
    // 에러 발생 시 캐시에서 가져오기
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cached_words')
      if (cached) {
        return JSON.parse(cached) as ChineseWord[]
      }
    }
    
    return []
  }
}