module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: { extend: {
    colors: {
      page: 'var(--bg-page)', surface: 'var(--surface-1)', surface2: 'var(--surface-2)',
      border: 'var(--border)', ink: 'var(--text)', muted: 'var(--text-muted)',
      primary: 'var(--primary)', onprimary: 'var(--on-primary)',
      maroon: 'var(--maroon)', maroon2: 'var(--maroon-2)', gold: '#ffc21a',
    },
    fontFamily: {
      display: ['"Baloo Tamma 2"', '"Noto Serif Kannada"', 'serif'],
      kn: ['"Noto Sans Kannada"', 'sans-serif'],
      sans: ['Inter', 'sans-serif'],
    },
    boxShadow: { card: 'var(--elevation)', glow: 'var(--glow-primary)' },
  } },
}
