import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { demoDataset } from '../data/demoData'
import { availableMonths } from '../domain/analysis'
import { buildDashboardViewModel } from '../domain/viewModels'

const latestMonth = availableMonths(demoDataset.facts).at(-1) ?? '2026-07'
const view = buildDashboardViewModel(demoDataset.facts, demoDataset.today, latestMonth, {
  platform: 'all',
  campaignId: 'all',
  objective: 'all',
})

const currency = (value: number | null) => value === null
  ? 'Sin dato'
  : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)

const number = (value: number | null) => value === null ? 'Sin dato' : new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value)
const percent = (value: number | null) => value === null ? 'Sin dato' : `${value.toFixed(1)}%`
const ratio = (value: number | null) => value === null ? 'Sin dato' : `${value.toFixed(2)}x`
const monthLabel = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(new Date(`${latestMonth}-15T12:00:00`))

function MetricCard({ label, value, detail, tone = '' }: { label: string; value: string; detail: string; tone?: string }) {
  return <article className={`signal-data-card ${tone}`}>
    <span className="signal-card-label">{label}</span>
    <strong className="signal-data-value">{value}</strong>
    <span className="signal-card-detail">{detail}</span>
  </article>
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion()
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={reducedMotion ? undefined : { duration: .72, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

export function SignalShell() {
  const opportunity = view.alerts.find((alert) => alert.title.toLowerCase().includes('oportunidad')) ?? view.alerts[0]
  const isEfficient = view.metrics.acos.value !== null && view.metrics.acos.value < 10

  return <main className="signal-shell">
    <header className="signal-nav">
      <a className="signal-brand" href="/select"><span className="signal-symbol">FM</span><span>Signal / Paid Media Intelligence</span></a>
      <div className="signal-nav-meta"><span>Faithis demo · {monthLabel}</span><a href="/" className="signal-nav-link">Classic dashboard ↗</a></div>
    </header>

    <section className="signal-section signal-hero">
      <Reveal className="signal-hero-copy">
        <p className="signal-eyebrow">Profitability / current signal</p>
        <h1>El rendimiento<br /><em>deja una señal.</em></h1>
        <p className="signal-lede">Una lectura editorial del sistema de paid media: dónde se construye la demanda, dónde se convierte y qué margen queda después de invertir.</p>
        <a className="signal-scroll-cue" href="#acquisition">Explorar la señal <span>↓</span></a>
      </Reveal>
      <Reveal className="signal-hero-visual" delay={.12}>
        <div className="signal-orbit signal-orbit-outer" />
        <div className="signal-orbit signal-orbit-middle" />
        <div className="signal-orbit signal-orbit-inner" />
        <div className="signal-hero-metric"><span>ACOS actual</span><strong>{percent(view.metrics.acos.value)}</strong><small>{isEfficient ? 'Por debajo del objetivo' : 'Por encima del objetivo'} · objetivo 10%</small></div>
      </Reveal>
    </section>

    <motion.section className="signal-proof-grid signal-section" aria-label="Indicadores de rentabilidad" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .8 }}>
      <MetricCard label="ROAS" value={ratio(view.metrics.roas.value)} detail="facturación bruta / inversión" tone={isEfficient ? 'signal-positive' : ''} />
      <MetricCard label="Margen de contribución" value={currency(view.metrics.contributionMargin.value)} detail="antes de medios pagos" />
      <MetricCard label="ACOS de equilibrio" value={percent(view.metrics.breakEvenAcos.value)} detail="límite de rentabilidad" />
      <MetricCard label="Margen después de ads" value={currency(view.metrics.marginAfterAds.value)} detail="resultado del período" tone="signal-accent" />
    </motion.section>

    <section id="acquisition" className="signal-chapter signal-chapter-dark">
      <div className="signal-section">
        <div className="signal-chapter-head"><div><span className="signal-chapter-index">01 / Adquisición</span><h2>La señal empieza<br /><em>antes del clic.</em></h2></div><p>Alcance y atención son la primera capa del sistema. Esta lectura muestra la presión de inversión que alimenta el embudo.</p></div>
        <div className="signal-metric-row">
          <MetricCard label="Impresiones" value={number(view.currentAggregate.impressions)} detail="exposiciones acumuladas" />
          <MetricCard label="Clics" value={number(view.currentAggregate.clicks)} detail="tráfico atribuido" />
          <MetricCard label="CTR" value={percent(view.metrics.ctr.value)} detail="interés sobre alcance" />
          <MetricCard label="CPC" value={currency(view.metrics.cpc.value)} detail="costo por visita" />
        </div>
        <div className="signal-platform-list"><div className="signal-list-heading"><span>Plataforma</span><span>Inversión</span><span>ACOS</span></div>{view.platformRows.map((row) => <div className="signal-platform-row" key={row.platform}><strong>{row.platform}</strong><span>{currency(row.aggregate.spend)}</span><span className={row.metrics.acos.value !== null && row.metrics.acos.value < 10 ? 'signal-good' : ''}>{percent(row.metrics.acos.value)}</span></div>)}</div>
      </div>
    </section>

    <section id="conversion" className="signal-chapter signal-chapter-light">
      <div className="signal-section">
        <div className="signal-chapter-head"><div><span className="signal-chapter-index">02 / Conversión</span><h2>La atención<br /><em>encuentra valor.</em></h2></div><p>La eficiencia se vuelve tangible cuando el tráfico produce conversiones y facturación. Los faltantes permanecen visibles.</p></div>
        <div className="signal-metric-row"><MetricCard label="Conversiones" value={number(view.currentAggregate.conversions)} detail="acciones atribuidas" /><MetricCard label="CPA" value={currency(view.metrics.cpa.value)} detail="inversión por conversión" /><MetricCard label="Facturación bruta" value={currency(view.currentAggregate.grossRevenue)} detail="valor atribuido" /><MetricCard label="ACOS" value={percent(view.metrics.acos.value)} detail="gasto / facturación bruta" tone="signal-accent" /></div>
        <div className="signal-campaign-list"><div className="signal-list-heading"><span>Campaña</span><span>Conversiones</span><span>ROAS</span></div>{view.campaignRows.slice(0, 4).map((row) => <div className="signal-platform-row" key={row.campaignId}><strong>{row.name}</strong><span>{number(row.aggregate.conversions)}</span><span>{ratio(row.metrics.roas.value)}</span></div>)}</div>
      </div>
    </section>

    <section id="profitability" className="signal-chapter signal-chapter-profit">
      <div className="signal-section signal-profit-layout"><div><span className="signal-chapter-index">03 / Rentabilidad</span><h2>El margen es<br /><em>la decisión.</em></h2><p className="signal-profit-copy">Cuando el ACOS está por debajo del punto de equilibrio, existe capacidad económica para capturar más demanda. La oportunidad debe validarse con el contexto comercial.</p></div><div className="signal-profit-number"><span>Margen disponible después de ads</span><strong>{currency(view.metrics.marginAfterAds.value)}</strong><small>Margen de contribución {currency(view.metrics.contributionMargin.value)} menos inversión {currency(view.currentAggregate.spend)}</small></div></div>
    </section>

    <section className="signal-section signal-hypothesis"><div><span className="signal-eyebrow">Hypothesis / next move</span><h2>{opportunity?.title ?? 'Señal de inversión'}</h2><p>{opportunity?.detail ?? 'El sistema no presenta una anomalía accionable para este período.'}</p></div><span className="signal-hypothesis-badge">Hipótesis respaldada por datos</span></section>
    <footer className="signal-footer signal-section"><span>FM Signal</span><span>Paid media intelligence · {monthLabel}</span><a href="/select">Cambiar experiencia ↗</a></footer>
  </main>
}
