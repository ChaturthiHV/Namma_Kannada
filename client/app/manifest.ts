export default function manifest() {
 return { name: 'Namma Kannada', short_name: 'Namma Kannada', description: 'Different regions. Same heart. One Kannada.', start_url: '/', display: 'standalone', orientation: 'portrait', background_color: '#fff6dc', theme_color: '#8e1015',
  icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }] }
}
