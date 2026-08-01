import { aggregateFacts, calculateMetrics, type MetricValue } from './metrics'
import type { CampaignFact } from './types'

export type AlertSeverity = 'informativa' | 'advertencia' | 'crítica'

export interface PeriodWindow {
  monthKey: string
  start: string
  end: string
  elapsedDays: number
  isPartial: boolean
}

export interface MetricVariation {
  value: number | null
  status: 'calculated' | 'missing' | 'no-baseline'
}

export interface Alert {
  id: string
  severity: AlertSeverity
  title: string
  detail: string
  campaignId?: string
  date?: string
}

const toDate = (value: string) => new Date(`${value}T00:00:00Z`)

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)

const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

const daysBetween = (start: Date, end: Date) =>
  Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1

const monthEnd = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number)
  return new Date(Date.UTC(year, month, 0))
}

export const availableMonths = (facts: CampaignFact[]) =>
  [...new Set(facts.map((fact) => fact.monthKey))].sort((a, b) => b.localeCompare(a))

export const getPeriodWindow = (monthKey: string, today: string): PeriodWindow => {
  const start = toDate(`${monthKey}-01`)
  const calendarEnd = monthEnd(monthKey)
  const selectedEnd = calendarEnd < toDate(today) ? calendarEnd : toDate(today)

  return {
    monthKey,
    start: toIsoDate(start),
    end: toIsoDate(selectedEnd),
    elapsedDays: daysBetween(start, selectedEnd),
    isPartial: selectedEnd < calendarEnd,
  }
}

export const getPreviousComparableWindow = (window: PeriodWindow): PeriodWindow => {
  const previousMonthDate = addDays(toDate(`${window.monthKey}-01`), -1)
  const previousMonthKey = toIsoDate(previousMonthDate).slice(0, 7)
  const previousStart = toDate(`${previousMonthKey}-01`)
  const previousCalendarEnd = monthEnd(previousMonthKey)
  const previousEnd = addDays(previousStart, window.elapsedDays - 1)
  const boundedEnd = previousEnd > previousCalendarEnd ? previousCalendarEnd : previousEnd

  return {
    monthKey: previousMonthKey,
    start: toIsoDate(previousStart),
    end: toIsoDate(boundedEnd),
    elapsedDays: daysBetween(previousStart, boundedEnd),
    isPartial: boundedEnd < previousCalendarEnd,
  }
}

export const factsInWindow = (facts: CampaignFact[], window: PeriodWindow) =>
  facts.filter((fact) => fact.date >= window.start && fact.date <= window.end)

export const variation = (current: MetricValue, previous: MetricValue): MetricVariation => {
  if (current.value === null || previous.value === null) return { value: null, status: 'missing' }
  if (previous.value === 0) return { value: null, status: 'no-baseline' }
  return { value: ((current.value - previous.value) / Math.abs(previous.value)) * 100, status: 'calculated' }
}

const groupByCampaign = (facts: CampaignFact[]) => {
  const grouped = new Map<string, CampaignFact[]>()
  facts.forEach((fact) => {
    const existing = grouped.get(fact.campaignId) ?? []
    existing.push(fact)
    grouped.set(fact.campaignId, existing)
  })
  return grouped
}

const formatPercent = (value: number) => `${value.toFixed(1)}%`

export const buildAlerts = (currentFacts: CampaignFact[], previousFacts: CampaignFact[], acosTarget = 10): Alert[] => {
  const alerts: Alert[] = []
  const previousByCampaign = groupByCampaign(previousFacts)

  for (const [campaignId, campaignFacts] of groupByCampaign(currentFacts)) {
    const currentAggregate = aggregateFacts(campaignFacts)
    const currentMetrics = calculateMetrics(currentAggregate)
    const previousAggregate = aggregateFacts(previousByCampaign.get(campaignId) ?? [])

    if (currentAggregate.spend > 0 && currentAggregate.conversions === 0) {
      alerts.push({
        id: `${campaignId}-no-conversions`,
        severity: 'crítica',
        title: 'Gasto sin conversiones',
        detail: 'La campaña registra inversión, pero no conversiones en el período seleccionado.',
        campaignId,
      })
    }

    if (currentMetrics.acos.value !== null && currentMetrics.acos.value > acosTarget) {
      alerts.push({
        id: `${campaignId}-acos-target`,
        severity: currentMetrics.breakEvenAcos.value !== null && currentMetrics.acos.value > currentMetrics.breakEvenAcos.value
          ? 'crítica'
          : 'advertencia',
        title: 'ACOS por encima del benchmark',
        detail: `ACOS actual ${formatPercent(currentMetrics.acos.value)} vs. objetivo ${formatPercent(acosTarget)}.`,
        campaignId,
      })
    }

    const previousMetrics = calculateMetrics(previousAggregate)
    const spendVariation = variation(
      { value: currentAggregate.spend, status: 'calculated' },
      { value: previousAggregate.spend, status: previousAggregate.spend === 0 ? 'zero-denominator' : 'calculated' },
    )

    if (
      currentMetrics.acos.value !== null
      && currentMetrics.acos.value < acosTarget
      && (spendVariation.value === null || spendVariation.value <= 10)
    ) {
      alerts.push({
        id: `${campaignId}-scale-opportunity`,
        severity: 'informativa',
        title: 'Oportunidad de escalar inversión',
        detail: `ACOS actual ${formatPercent(currentMetrics.acos.value)}: está por debajo del objetivo de ${formatPercent(acosTarget)} y la inversión no creció al mismo ritmo.`,
        campaignId,
      })
    }

    if (spendVariation.value !== null && spendVariation.value > 50) {
      alerts.push({
        id: `${campaignId}-spend-change`,
        severity: 'advertencia',
        title: 'Aumento relevante de inversión',
        detail: `La inversión creció ${formatPercent(spendVariation.value)} contra el período comparable.`,
        campaignId,
      })
    }

    if (previousMetrics.acos.value !== null && currentMetrics.acos.value !== null && currentMetrics.acos.value > previousMetrics.acos.value * 1.3) {
      alerts.push({
        id: `${campaignId}-acos-drift`,
        severity: 'advertencia',
        title: 'ACOS deteriorado',
        detail: 'El ACOS aumentó más de 30% contra el período comparable.',
        campaignId,
      })
    }
  }

  currentFacts.filter((fact) => fact.grossRevenue === null).forEach((fact) => {
    alerts.push({
      id: `${fact.campaignId}-${fact.date}-missing-revenue`,
      severity: 'informativa',
      title: 'Facturación no disponible',
      detail: 'La facturación de esta fila no permite calcular ACOS o margen.',
      campaignId: fact.campaignId,
      date: fact.date,
    })
  })

  return alerts
}
