'use client'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [m, setM] = useState(false); const { t } = useI18n()
  useEffect(() => setM(true), [])
  const dark = m && resolvedTheme === 'dark'
  return (
    <div className="flex rounded-full bg-surface p-1 shadow-card" role="group" aria-label={t('Theme')}>
      <button aria-label={t('Light')} onClick={() => setTheme('light')} className={`rounded-full p-1.5 ${!dark ? 'bg-primary text-onprimary' : 'text-muted'}`}><Sun size={16} /></button>
      <button aria-label={t('Dark')} onClick={() => setTheme('dark')} className={`rounded-full p-1.5 ${dark ? 'bg-primary text-onprimary' : 'text-muted'}`}><Moon size={16} /></button>
    </div>
  )
}
