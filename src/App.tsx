import { useMemo, useState } from 'react'
import { demoDataset } from './data/demoData'
import {
  ACOS_TARGET,
  aggregateFacts,
  calculateMetrics,
  type DerivedMetrics,
  type MetricValue,
} from './domain/metrics'
import {
  availableMonths,
  buildAlerts,
  factsInWindow,
  getPeriodWindow,
  getPreviousComparableWindow,
  variation,
  type Alert,
  type PeriodWindow,
} from './domain/analysis'
import type { CampaignFact, Objective, Platform } from './domain/types'

type Tone = 'neutral' | 'blue' | 'violet' | 'green' | 'warning'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })

const percentFormatter = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
})

const formatCurrency = (value: number | null) => value === null ? '—' : currencyFormatter.format(value)
const formatNumber = (value: number | null) => value === null ? '—' : numberFormatter.format(value)
const formatPercent = (value: number | null) => value === null ? '—' : `${percentFormatter.format(value)}%`
const formatRatio = (value: number | null) => value === null ? '—' : `${value.toFixed(2)}x`

const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number)
  return new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(new Date(Date.UTC(year, month - 1, 1)))
}

const formatDateRange = (window: PeriodWindow) => {
  const start = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' }).format(new Date(`${window.start}T00:00:00Z`))
  const end = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${window.end}T00:00:00Z`))
  return `${start} — ${end}`
}

const metricDisplay = (metric: MetricValue, kind: 'currency' | 'number' | 'percent' | 'ratio') => {
  if (metric.status !== 'calculated') return '—'
  if (kind === 'currency') return formatCurrency(metric.value)
  if (kind === 'percent') return formatPercent(metric.value)
  if (kind === 'ratio') return formatRatio(metric.value)
  return formatNumber(metric.value)
}

const metricStatus = (metric: MetricValue) => {
  if (metric.status === 'missing') return 'Dato no disponible'
  if (metric.status === 'zero-denominator') return 'No calculable'
  return undefined
}

const getChangeLabel = (metric: MetricValue, previous: MetricValue) => {
  const change = variation(metric, previous)
  if (change.status !== 'calculated' || change.value === null) return 'Sin base comparable'
  return `${change.value >= 0 ? '+' : ''}${formatPercent(change.value)} vs. período anterior`
}

const filterFacts = (
  facts: CampaignFact[],
  platform: Platform | 'all',
  campaignId: string,
  objective: Objective | 'all',
) => facts.filter((fact) =>
  (platform === 'all' || fact.platform === platform)
  && (campaignId === 'all' || fact.campaignId === campaignId)
  && (objective === 'all' || fact.objective === objective),
)

const aggregateByCampaign = (facts: CampaignFact[]) => {
  const groups = new Map<string, CampaignFact[]>()
  facts.forEach((fact) => groups.set(fact.campaignId, [...(groups.get(fact.campaignId) ?? []), fact]))
  return [...groups.entries()].map(([campaignId, rows]) => ({
    campaignId,
    name: rows[0].campaignName,
    platform: rows[0].platform,
    objective: rows[0].objective,
    facts: rows,
    aggregate: aggregateFacts(rows),
    metrics: calculateMetrics(aggregateFacts(rows)),
  }))
}

const statusForAcos = (metrics: DerivedMetrics) => {
  if (metrics.acos.value === null) return { label: 'Sin dato', className: 'status-neutral' }
  if (metrics.breakEvenAcos.value !== null && metrics.acos.value > metrics.breakEvenAcos.value) {
    return { label: 'Sobre equilibrio', className: 'status-critical' }
  }
  if (metrics.acos.value > ACOS_TARGET) return { label: 'Sobre benchmark', className: 'status-warning' }
  return { label: 'Eficiente · escalar', className: 'status-good' }
}

function KpiCard({ label, value, change, tone = 'neutral', note }: { label: string; value: string; change: string; tone?: Tone; note?: string }) {
  return (
    <article className={`kpi-card tone-${tone}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-meta">{change}</div>
      {note && <div className="kpi-note">{note}</div>}
    </article>
  )
}

function SectionHeader({ number, title, description, tone }: { number: string; title: string; description: string; tone: Tone }) {
  return (
    <div className="section-header">
      <span className={`section-number tone-${tone}`}>{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

function TrendPanel({ facts }: { facts: CampaignFact[] }) {
  const points = useMemo(() => {
    const byDay = new Map<string, CampaignFact[]>()
    facts.forEach((fact) => byDay.set(fact.date, [...(byDay.get(fact.date) ?? []), fact]))
    return [...byDay.entries()].map(([date, rows]) => {
      const aggregate = aggregateFacts(rows)
      return { date, spend: aggregate.spend, revenue: aggregate.grossRevenue ?? 0 }
    }).sort((a, b) => a.date.localeCompare(b.date))
  }, [facts])
  const maxValue = Math.max(...points.flatMap((point) => [point.spend, point.revenue]), 1)
  const width = 720
  const height = 170
  const horizontal = (value: number, index: number) => `${(index / Math.max(points.length - 1, 1)) * width},${height - (value / maxValue) * 125 - 10}`

  return (
    <div className="trend-panel panel-surface">
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">Ritmo del período</span>
          <h3>Gasto y facturación bruta</h3>
        </div>
        <span className="chart-note">índice relativo</span>
      </div>
      <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Tendencia relativa de gasto y facturación bruta">
        <path d={`M ${points.map((point, index) => horizontal(point.spend, index)).join(' L ')}`} className="chart-line chart-line-blue" />
        <path d={`M ${points.map((point, index) => horizontal(point.revenue, index)).join(' L ')}`} className="chart-line chart-line-green" />
      </svg>
      <div className="chart-legend"><span><i className="legend-dot dot-blue" /> Gasto</span><span><i className="legend-dot dot-green" /> Facturación bruta</span><span className="legend-muted">ACOS objetivo 10%</span></div>
    </div>
  )
}

function PlatformBreakdown({ rows }: { rows: { platform: Platform; facts: CampaignFact[]; metrics: DerivedMetrics }[] }) {
  const maxSpend = Math.max(...rows.map((row) => row.metrics.acos.value ?? 0), 1)
  return (
    <div className="breakdown-list">
      {rows.map((row) => {
        const aggregate = aggregateFacts(row.facts)
        const share = ((row.metrics.acos.value ?? 0) / maxSpend) * 100
        return (
          <div className="breakdown-row" key={row.platform}>
            <div className="breakdown-head"><span>{row.platform}</span><strong>{formatCurrency(aggregate.spend)}</strong></div>
            <div className="bar-track"><span className={`bar-fill ${row.platform === 'Google Ads' ? 'bar-blue' : 'bar-violet'}`} style={{ width: `${Math.max(share, 7)}%` }} /></div>
            <div className="breakdown-foot"><span>ACOS {formatPercent(row.metrics.acos.value)}</span><span>{formatNumber(aggregate.clicks)} clics</span></div>
          </div>
        )
      })}
    </div>
  )
}

function AlertList({ alerts, onSelect }: { alerts: Alert[]; onSelect: (alert: Alert) => void }) {
  return (
    <div className="alert-list">
      {alerts.length === 0 && <div className="empty-state">No hay anomalías relevantes en este contexto.</div>}
      {alerts.slice(0, 5).map((alert) => (
        <button type="button" className="alert-item" key={alert.id} onClick={() => onSelect(alert)}>
          <span className={`alert-icon alert-${alert.severity}`}>{alert.severity === 'crítica' ? '!' : alert.severity === 'advertencia' ? '△' : 'i'}</span>
          <span className="alert-copy"><strong>{alert.title}</strong><small>{alert.detail}</small></span>
          <span className="alert-arrow">↗</span>
        </button>
      ))}
    </div>
  )
}

function App() {
  const months = availableMonths(demoDataset.facts)
  const [selectedMonth, setSelectedMonth] = useState(months[0])
  const [platform, setPlatform] = useState<Platform | 'all'>('all')
  const [campaignId, setCampaignId] = useState('all')
  const [objective, setObjective] = useState<Objective | 'all'>('all')
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

  const currentWindow = getPeriodWindow(selectedMonth, demoDataset.today)
  const previousWindow = getPreviousComparableWindow(currentWindow)
  const currentFacts = useMemo(() => filterFacts(factsInWindow(demoDataset.facts, currentWindow), platform, campaignId, objective), [currentWindow, platform, campaignId, objective])
  const previousFacts = useMemo(() => filterFacts(factsInWindow(demoDataset.facts, previousWindow), platform, campaignId, objective), [previousWindow, platform, campaignId, objective])
  const currentAggregate = useMemo(() => aggregateFacts(currentFacts), [currentFacts])
  const previousAggregate = useMemo(() => aggregateFacts(previousFacts), [previousFacts])
  const metrics = useMemo(() => calculateMetrics(currentAggregate), [currentAggregate])
  const previousMetrics = useMemo(() => calculateMetrics(previousAggregate), [previousAggregate])
  const alerts = useMemo(() => buildAlerts(currentFacts, previousFacts), [currentFacts, previousFacts])
  const campaignRows = useMemo(() => aggregateByCampaign(currentFacts), [currentFacts])
  const platformRows = useMemo(() => (['Google Ads', 'Meta Ads'] as Platform[]).map((item) => {
    const rows = currentFacts.filter((fact) => fact.platform === item)
    return { platform: item, facts: rows, metrics: calculateMetrics(aggregateFacts(rows)) }
  }).filter((row) => row.facts.length > 0), [currentFacts])
  const selectedCampaign = campaignRows.find((row) => row.campaignId === selectedCampaignId)
  const selectedStatus = statusForAcos(metrics)
  const isCurrentMonth = selectedMonth === months[0]

  const changeFor = (metric: MetricValue, previous: MetricValue) => getChangeLabel(metric, previous)
  const grossRevenueMetric: MetricValue = { value: currentAggregate.grossRevenue, status: currentAggregate.grossRevenue === null ? 'missing' : 'calculated' }
  const previousGrossRevenueMetric: MetricValue = { value: previousAggregate.grossRevenue, status: previousAggregate.grossRevenue === null ? 'missing' : 'calculated' }
  const conversionsMetric: MetricValue = { value: currentAggregate.conversions, status: currentAggregate.conversions === null ? 'missing' : 'calculated' }
  const previousConversionsMetric: MetricValue = { value: previousAggregate.conversions, status: previousAggregate.conversions === null ? 'missing' : 'calculated' }
  const spendMetric: MetricValue = { value: currentAggregate.spend, status: 'calculated' }
  const previousSpendMetric: MetricValue = { value: previousAggregate.spend, status: 'calculated' }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup"><span className="brand-mark">F</span><div><strong>Faithis</strong><span>Paid media performance</span></div></div>
        <div className="topbar-actions"><span className="live-pip"><i /> Demo workspace</span><label className="month-control"><span>Período</span><select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} aria-label="Seleccionar mes"><option value="" disabled>Seleccionar mes</option>{months.map((month) => <option key={month} value={month}>{formatMonth(month)}</option>)}</select></label></div>
      </header>

      <section className="hero-row">
        <div className="period-rule"><span>{isCurrentMonth ? 'Mes en curso' : 'Mes calendario'}</span><small>Comparación contra los mismos días transcurridos del mes anterior.</small></div>
        <div><p className="eyebrow">Performance overview / {formatMonth(selectedMonth)}</p><h1>El rendimiento que mueve<br /><em>la decisión.</em></h1><p className="hero-copy">Lectura integrada de adquisición, conversión y rentabilidad para el período seleccionado.</p></div>
        <div className="period-summary"><span className="summary-label">Período activo</span><strong>{formatDateRange(currentWindow)}</strong><small>{currentWindow.elapsedDays} días transcurridos · comparación {formatDateRange(previousWindow)}</small><span className={`status-pill ${selectedStatus.className}`}>{selectedStatus.label}</span></div>
      </section>

      <section className="filter-bar" aria-label="Filtros del dashboard">
        <span className="filter-label">Explorar por</span>
        <label><span>Plataforma</span><select value={platform} onChange={(event) => setPlatform(event.target.value as Platform | 'all')}><option value="all">Todas</option><option value="Google Ads">Google Ads</option><option value="Meta Ads">Meta Ads</option></select></label>
        <label><span>Objetivo</span><select value={objective} onChange={(event) => setObjective(event.target.value as Objective | 'all')}><option value="all">Todos</option><option value="Awareness">Awareness</option><option value="Tráfico">Tráfico</option><option value="Prospecting">Prospecting</option><option value="Ventas">Ventas</option><option value="Remarketing">Remarketing</option></select></label>
        <label><span>Campaña</span><select value={campaignId} onChange={(event) => setCampaignId(event.target.value)}><option value="all">Todas</option>{[...new Map(demoDataset.facts.map((fact) => [fact.campaignId, fact.campaignName])).entries()].map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
        {(platform !== 'all' || objective !== 'all' || campaignId !== 'all') && <button className="clear-filter" type="button" onClick={() => { setPlatform('all'); setObjective('all'); setCampaignId('all') }}>Limpiar filtros</button>}
      </section>

      <section className="kpi-grid" aria-label="Indicadores principales">
        <KpiCard label="Inversión" value={formatCurrency(currentAggregate.spend)} change={changeFor(spendMetric, previousSpendMetric)} tone="blue" />
        <KpiCard label="Facturación bruta" value={formatCurrency(currentAggregate.grossRevenue)} change={changeFor(grossRevenueMetric, previousGrossRevenueMetric)} tone="green" note={metricStatus(grossRevenueMetric)} />
        <KpiCard label="ACOS" value={metricDisplay(metrics.acos, 'percent')} change={`Objetivo ${ACOS_TARGET}%`} tone="violet" note={metricStatus(metrics.acos)} />
        <KpiCard label="ROAS" value={metricDisplay(metrics.roas, 'ratio')} change={changeFor(metrics.roas, previousMetrics.roas)} tone="green" note={metricStatus(metrics.roas)} />
        <KpiCard label="Facturación neta" value={metricDisplay(metrics.netRevenue, 'currency')} change={changeFor(metrics.netRevenue, previousMetrics.netRevenue)} tone="neutral" note={metricStatus(metrics.netRevenue)} />
        <KpiCard label="Margen de contribución" value={metricDisplay(metrics.contributionMargin, 'currency')} change={changeFor(metrics.contributionMargin, previousMetrics.contributionMargin)} tone="green" note={metricStatus(metrics.contributionMargin)} />
      </section>

      <section className="overview-grid">
        <TrendPanel facts={currentFacts} />
        <div className="panel-surface alert-panel"><div className="panel-heading"><div><span className="panel-kicker">Control de calidad</span><h3>Señales para mirar</h3></div><span className="alert-count">{alerts.length.toString().padStart(2, '0')}</span></div><AlertList alerts={alerts} onSelect={setSelectedAlert} /></div>
      </section>

      <section className="dashboard-section"><SectionHeader number="01" title="Adquisición" description="Alcance e inversión que alimentan el funnel." tone="blue" /><div className="section-grid"><div className="panel-surface metric-panel"><div className="panel-heading"><div><span className="panel-kicker">Mix de plataformas</span><h3>Distribución del gasto</h3></div><span className="chart-note">ARS</span></div><PlatformBreakdown rows={platformRows} /></div><div className="panel-surface metric-panel"><div className="panel-heading"><div><span className="panel-kicker">Volumen</span><h3>Tracción de medios</h3></div></div><div className="metric-triplet"><div><span>Impresiones</span><strong>{formatNumber(currentAggregate.impressions)}</strong></div><div><span>Clics</span><strong>{formatNumber(currentAggregate.clicks)}</strong></div><div><span>CTR</span><strong>{metricDisplay(metrics.ctr, 'percent')}</strong></div></div><div className="micro-note">CPC medio <strong>{metricDisplay(metrics.cpc, 'currency')}</strong> · variación de clics {changeFor({ value: currentAggregate.clicks, status: currentAggregate.clicks === null ? 'missing' : 'calculated' }, { value: previousAggregate.clicks, status: previousAggregate.clicks === null ? 'missing' : 'calculated' })}</div></div></div></section>

      <section className="dashboard-section"><SectionHeader number="02" title="Conversión" description="La eficiencia de transformar intención en compra." tone="violet" /><div className="section-grid conversion-grid"><div className="panel-surface metric-panel"><div className="panel-heading"><div><span className="panel-kicker">Eficiencia comercial</span><h3>CPA y ACOS</h3></div><span className={`status-pill ${selectedStatus.className}`}>{selectedStatus.label}</span></div><div className="metric-triplet metric-triplet-large"><div><span>Conversiones</span><strong>{formatNumber(currentAggregate.conversions)}</strong><small>{changeFor(conversionsMetric, previousConversionsMetric)}</small></div><div><span>CPA</span><strong>{metricDisplay(metrics.cpa, 'currency')}</strong><small>{metricStatus(metrics.cpa) ?? 'Costo por compra'}</small></div><div><span>ACOS</span><strong>{metricDisplay(metrics.acos, 'percent')}</strong><small>Benchmark {ACOS_TARGET}%</small></div></div></div><div className="panel-surface table-panel"><div className="panel-heading"><div><span className="panel-kicker">Detalle accionable</span><h3>Campañas</h3></div><span className="chart-note">seleccionar para detalle</span></div><div className="campaign-table"><div className="table-head"><span>Campaña</span><span>Compras</span><span>CPA</span><span>ACOS</span></div>{campaignRows.map((row) => { const status = statusForAcos(row.metrics); return <button type="button" className="table-row" key={row.campaignId} onClick={() => setSelectedCampaignId(row.campaignId)}><span><strong>{row.name}</strong><small>{row.platform} · {row.objective}</small></span><span>{formatNumber(row.aggregate.conversions)}</span><span>{metricDisplay(row.metrics.cpa, 'currency')}</span><span className={status.className}>{metricDisplay(row.metrics.acos, 'percent')}</span></button> })}</div></div></div></section>

      <section className="dashboard-section"><SectionHeader number="03" title="Rentabilidad" description="Lo que queda después de vender y pagar la pauta." tone="green" /><div className="profit-grid"><div className="panel-surface profit-card"><span className="panel-kicker">Punto de equilibrio</span><strong>{metricDisplay(metrics.breakEvenAcos, 'percent')}</strong><p>ACOS máximo sostenible según margen antes de publicidad.</p><div className="equilibrium-line"><span className="equilibrium-current" style={{ width: `${Math.min((metrics.acos.value ?? 0) / Math.max(metrics.breakEvenAcos.value ?? ACOS_TARGET, ACOS_TARGET) * 100, 100)}%` }} /><span className="equilibrium-target" style={{ left: `${Math.min((ACOS_TARGET / Math.max(metrics.breakEvenAcos.value ?? ACOS_TARGET, ACOS_TARGET)) * 100, 100)}%` }} /></div><div className="equilibrium-labels"><span>ACOS actual {formatPercent(metrics.acos.value)}</span><span>Objetivo {ACOS_TARGET}%</span></div></div><div className="panel-surface profit-card"><span className="panel-kicker">Resultado después de pauta</span><strong>{metricDisplay(metrics.marginAfterAds, 'currency')}</strong><p>Margen de contribución menos inversión publicitaria.</p><div className="profit-meta"><span>Margen antes de pauta <b>{metricDisplay(metrics.contributionMargin, 'currency')}</b></span><span>Inversión <b>{formatCurrency(currentAggregate.spend)}</b></span></div></div><div className="panel-surface methodology-card"><span className="panel-kicker">Metodología</span><h3>Dos umbrales, una lectura.</h3><p>El benchmark operativo de ACOS es <strong>10%</strong>. El equilibrio se calcula dinámicamente según margen de contribución antes de pauta.</p><button type="button" className="text-button" onClick={() => setSelectedAlert({ id: 'methodology', severity: 'informativa', title: 'Metodología de rentabilidad', detail: 'ACOS = inversión / facturación bruta. Equilibrio = margen antes de pauta / facturación bruta.' })}>Ver fórmulas ↗</button></div></div></section>

      {(selectedCampaign || selectedAlert) && <aside className="detail-drawer" aria-label="Detalle seleccionado"><button type="button" className="drawer-close" onClick={() => { setSelectedCampaignId(null); setSelectedAlert(null) }}>×</button>{selectedCampaign && <><span className="panel-kicker">Detalle de campaña</span><h2>{selectedCampaign.name}</h2><p className="drawer-subtitle">{selectedCampaign.platform} · {selectedCampaign.objective}</p><div className="drawer-stats"><span><small>Inversión</small><strong>{formatCurrency(selectedCampaign.aggregate.spend)}</strong></span><span><small>Compras</small><strong>{formatNumber(selectedCampaign.aggregate.conversions)}</strong></span><span><small>ACOS</small><strong>{metricDisplay(selectedCampaign.metrics.acos, 'percent')}</strong></span><span><small>Equilibrio</small><strong>{metricDisplay(selectedCampaign.metrics.breakEvenAcos, 'percent')}</strong></span></div><p className="drawer-description">{statusForAcos(selectedCampaign.metrics).label}. El detalle respeta el período y los filtros activos.</p></>}{selectedAlert && !selectedCampaign && <><span className="panel-kicker">Señal del sistema</span><h2>{selectedAlert.title}</h2><span className={`status-pill status-${selectedAlert.severity === 'crítica' ? 'critical' : selectedAlert.severity === 'advertencia' ? 'warning' : 'neutral'}`}>{selectedAlert.severity}</span><p className="drawer-description">{selectedAlert.detail}</p><p className="drawer-description">La alerta se presenta como una señal de análisis; no afirma causalidad sin evidencia adicional.</p></>}</aside>}

      <footer className="footer"><span>Faithis · Paid media performance</span><span>Actualizado al {formatDateRange(currentWindow)} · ARS</span></footer>
    </main>
  )
}

export default App
