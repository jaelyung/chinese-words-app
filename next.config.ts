const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}  // 빈 turbopack 설정 추가
}

module.exports = nextConfig // withPWA 제거