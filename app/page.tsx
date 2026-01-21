'use client'

import { useEffect, useState } from 'react'
import { getWords, ChineseWord } from '@/lib/supabase'

export default function Home() {
  const [words, setWords] = useState<ChineseWord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showMeaning, setShowMeaning] = useState(false)

  // 단어 불러오기
  useEffect(() => {
    async function loadWords() {
      const data = await getWords()
      setWords(data)
      setLoading(false)  // ← false로 변경!
    }
    loadWords()
  }, [])

  // 중국어 발음 재생
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }

  // 다음 단어
  const nextWord = () => {
    setShowMeaning(false)
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  // 이전 단어
  const prevWord = () => {
    setShowMeaning(false)
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">단어를 불러오는 중...</p>
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">단어가 없습니다. Supabase에 단어를 추가해주세요.</p>
      </div>
    )
  }

  const currentWord = words[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-10">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            중국어 단어 학습
          </h1>
          <p className="text-gray-600">
            {currentIndex + 1} / {words.length} 단어
          </p>
        </div>

        {/* 단어 카드 */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          {/* HSK 레벨 */}
          <div className="flex justify-between items-center mb-6">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
              HSK {currentWord.hsk_level}
            </span>
            <button
              onClick={() => speak(currentWord.simplified)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
            >
              🔊 발음 듣기
            </button>
          </div>

          {/* 중국어 */}
          <div className="text-center mb-8">
            <p className="text-7xl font-bold text-gray-800 mb-4">
              {currentWord.simplified}
            </p>
            <p className="text-3xl text-gray-500 mb-2">
              {currentWord.traditional}
            </p>
            <p className="text-2xl text-indigo-600">
              {currentWord.pinyin}
            </p>
          </div>

          {/* 뜻 보기 버튼/뜻 */}
          <div className="text-center">
            {!showMeaning ? (
              <button
                onClick={() => setShowMeaning(true)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-full text-lg font-semibold transition-colors"
              >
                뜻 보기
              </button>
            ) : (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                <p className="text-2xl font-semibold text-green-800">
                  {currentWord.meaning}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={prevWord}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-800 py-4 rounded-2xl font-semibold shadow-lg transition-colors"
          >
            ← 이전 단어
          </button>
          <button
            onClick={nextWord}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold shadow-lg transition-colors"
          >
            다음 단어 →
          </button>
        </div>
      </div>
    </div>
  )
}