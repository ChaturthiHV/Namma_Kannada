/** @type {import('next').NextConfig} */
module.exports = { reactStrictMode: true, headers: async () => [{ source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }] }] }
