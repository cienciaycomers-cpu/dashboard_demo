import { demoDataset } from '../data/demoData'
import { availableMonths } from '../domain/analysis'
import { buildDashboardViewModel } from '../domain/viewModels'

const formatPercent = (value: number | null) => value === null ? 'N/D' : `${value.toFixed(1)}%`
const latestMonth = availableMonths(demoDataset.facts)[0]
const view = buildDashboardViewModel(demoDataset.facts, demoDataset.today, latestMonth, {
  platform: 'all',
  campaignId: 'all',
  objective: 'all',
})

export function SignalShell() {
  return (
    <main className="signal-placeholder">
      <p className="selector-eyebrow">FM Signal / Paid Media Intelligence</p>
      <h1>La señal detrás<br /><em>del rendimiento.</em></h1>
      <p>La nueva experiencia cinematográfica se está preparando sobre el mismo motor analítico.</p>
      <div className="signal-placeholder-metrics"><span><small>ACOS</small><strong>{formatPercent(view.metrics.acos.value)}</strong></span><span><small>Margen de contribución</small><strong>{view.metrics.contributionMargin.value === null ? 'N/D' : 'Disponible'}</strong></span></div>
      <a href="/">Volver al dashboard operativo ↗</a>
    </main>
  )
}
