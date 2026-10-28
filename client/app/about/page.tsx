'use client'
import { PageHead } from '@/components/ui'
import { useEntries, useLS, ENTRIES } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
export default function About() {
 const { t } = useI18n(); const { all } = useEntries(); const [, a] = useLS<string[]>('explored', []); const [, b] = useLS<string[]>('learned', []); const [, c] = useLS('best', 0)
 const dl = () => { const u = URL.createObjectURL(new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' })); const x = document.createElement('a'); x.href = u; x.download = 'namma-kannada-dictionary.json'; x.click() }
 return (
  <div className="p-5"><PageHead en="About Namma Kannada" kn="ನಮ್ಮ ಕನ್ನಡ ಬಗ್ಗೆ" />
   <div className="card max-w-2xl space-y-3 text-sm"><p>{t('Standard Kannada is well documented. Regional speech is fading with younger generations. Namma Kannada is a community platform to document, hear, compare and practise it.')} <b>{t('Different regions. Same heart. One Kannada.')}</b></p>
    <p className="text-muted">{t('Sample entries are placeholders until verified by native speakers. Recordings need consent and can be deleted.')}</p>
    <p>{t('{a} verified words · {b} community submissions', { a: all.filter(e => e.status === 'verified').length, b: all.length - ENTRIES.length })}</p>
    <div className="flex flex-wrap gap-2"><button className="btn" onClick={dl}>{t('Download open dictionary')}</button><button className="btn2" onClick={() => { a(['mysuru', 'coastal', 'north']); b(['e1', 'e2']); c(120) }}>{t('Demo mode (seed progress)')}</button></div></div></div>
 )
}
