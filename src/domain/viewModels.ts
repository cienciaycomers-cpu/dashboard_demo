import {
  aggregateFacts,
  calculateMetrics,
  type AggregateFacts,
  type DerivedMetrics,
} from './metrics'
import {
  buildAlerts,
  factsInWindow,
  getPeriodWindow,
  getPreviousComparableWindow,
  type Alert,
  type PeriodWindow,
} from './analysis'
import type { CampaignFact, Objective, Platform } from './types'

export interface DashboardFilters {
  platform: Platform | 'all'
  campaignId: string
  objective: Objective | 'all'
}

export interface CampaignViewModel {
  campaignId: string
  name: string
  platform: Platform
  objective: Objective
  facts: CampaignFact[]
  aggregate: AggregateFacts
  metrics: DerivedMetrics
}

export interface PlatformViewModel {
  platform: Platform
  facts: CampaignFact[]
  aggregate: AggregateFacts
  metrics: DerivedMetrics
}

export interface DashboardViewModel {
  currentWindow: PeriodWindow
  previousWindow: PeriodWindow
  currentFacts: CampaignFact[]
  previousFacts: CampaignFact[]
  currentAggregate: AggregateFacts
  previousAggregate: AggregateFacts
  metrics: DerivedMetrics
  previousMetrics: DerivedMetrics
  alerts: Alert[]
  campaignRows: CampaignViewModel[]
  platformRows: PlatformViewModel[]
}

const filterFacts = (facts: CampaignFact[], filters: DashboardFilters) => facts.filter((fact) =>
  (filters.platform === 'all' || fact.platform === filters.platform)
  && (filters.campaignId === 'all' || fact.campaignId === filters.campaignId)
  && (filters.objective === 'all' || fact.objective === filters.objective),
)

const campaignRows = (facts: CampaignFact[]): CampaignViewModel[] => {
  const groups = new Map<string, CampaignFact[]>()
  facts.forEach((fact) => groups.set(fact.campaignId, [...(groups.get(fact.campaignId) ?? []), fact]))
  return [...groups.entries()].map(([campaignId, rows]) => {
    const aggregate = aggregateFacts(rows)
    return {
      campaignId,
      name: rows[0].campaignName,
      platform: rows[0].platform,
      objective: rows[0].objective,
      facts: rows,
      aggregate,
      metrics: calculateMetrics(aggregate),
    }
  })
}

const platformRows = (facts: CampaignFact[]): PlatformViewModel[] =>
  (['Google Ads', 'Meta Ads'] as Platform[]).map((platform) => {
    const rows = facts.filter((fact) => fact.platform === platform)
    const aggregate = aggregateFacts(rows)
    return { platform, facts: rows, aggregate, metrics: calculateMetrics(aggregate) }
  }).filter((row) => row.facts.length > 0)

export const buildDashboardViewModel = (
  facts: CampaignFact[],
  today: string,
  selectedMonth: string,
  filters: DashboardFilters,
): DashboardViewModel => {
  const currentWindow = getPeriodWindow(selectedMonth, today)
  const previousWindow = getPreviousComparableWindow(currentWindow)
  const currentFacts = filterFacts(factsInWindow(facts, currentWindow), filters)
  const previousFacts = filterFacts(factsInWindow(facts, previousWindow), filters)
  const currentAggregate = aggregateFacts(currentFacts)
  const previousAggregate = aggregateFacts(previousFacts)

  return {
    currentWindow,
    previousWindow,
    currentFacts,
    previousFacts,
    currentAggregate,
    previousAggregate,
    metrics: calculateMetrics(currentAggregate),
    previousMetrics: calculateMetrics(previousAggregate),
    alerts: buildAlerts(currentFacts, previousFacts),
    campaignRows: campaignRows(currentFacts),
    platformRows: platformRows(currentFacts),
  }
}
