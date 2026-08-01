import type {
  CampaignFact,
  DemoDataset,
  FunnelStage,
  Objective,
  Platform,
} from '../domain/types'

interface CampaignProfile {
  id: string
  name: string
  platform: Platform
  objective: Objective
  funnelStage: FunnelStage
  dailySpend: number
  ctr: number
  conversionRate: number
  averageOrderValue: number
  variableCostRate: number
}

const DEMO_TODAY = '2026-07-22'
const START_DATE = '2025-08-01'

const CAMPAIGNS: CampaignProfile[] = [
  {
    id: 'google-prospecting-01',
    name: 'Google · Prospecting · Shopping 01',
    platform: 'Google Ads',
    objective: 'Prospecting',
    funnelStage: 'Adquisición',
    dailySpend: 28500,
    ctr: 0.019,
    conversionRate: 0.021,
    averageOrderValue: 92000,
    variableCostRate: 0.53,
  },
  {
    id: 'google-sales-01',
    name: 'Google · Ventas · Search 01',
    platform: 'Google Ads',
    objective: 'Ventas',
    funnelStage: 'Conversión',
    dailySpend: 21800,
    ctr: 0.034,
    conversionRate: 0.041,
    averageOrderValue: 105000,
    variableCostRate: 0.49,
  },
  {
    id: 'google-remarketing-01',
    name: 'Google · Remarketing · Display 01',
    platform: 'Google Ads',
    objective: 'Remarketing',
    funnelStage: 'Conversión',
    dailySpend: 12400,
    ctr: 0.027,
    conversionRate: 0.052,
    averageOrderValue: 98000,
    variableCostRate: 0.51,
  },
  {
    id: 'meta-awareness-01',
    name: 'Meta · Awareness · Video 01',
    platform: 'Meta Ads',
    objective: 'Awareness',
    funnelStage: 'Adquisición',
    dailySpend: 19400,
    ctr: 0.012,
    conversionRate: 0.012,
    averageOrderValue: 87000,
    variableCostRate: 0.56,
  },
  {
    id: 'meta-prospecting-01',
    name: 'Meta · Prospecting · Catalog 01',
    platform: 'Meta Ads',
    objective: 'Prospecting',
    funnelStage: 'Adquisición',
    dailySpend: 24800,
    ctr: 0.016,
    conversionRate: 0.025,
    averageOrderValue: 91000,
    variableCostRate: 0.54,
  },
  {
    id: 'meta-remarketing-01',
    name: 'Meta · Remarketing · Catalog 01',
    platform: 'Meta Ads',
    objective: 'Remarketing',
    funnelStage: 'Conversión',
    dailySpend: 16100,
    ctr: 0.023,
    conversionRate: 0.047,
    averageOrderValue: 99000,
    variableCostRate: 0.5,
  },
]

const toDate = (value: string) => new Date(`${value}T00:00:00Z`)

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)

const round = (value: number) => Math.round(value)

const stableSignal = (date: Date, campaignIndex: number) => {
  const day = date.getUTCDate()
  const month = date.getUTCMonth() + 1
  return 1 + (((day * 7 + month * 11 + campaignIndex * 13) % 17) - 8) / 100
}

const seasonalFactor = (date: Date) => {
  const month = date.getUTCMonth() + 1
  const seasonality: Record<number, number> = {
    1: 0.9,
    2: 0.94,
    3: 0.98,
    4: 1.02,
    5: 1.04,
    6: 1.08,
    7: 1.16,
    8: 0.92,
    9: 0.96,
    10: 1.05,
    11: 1.22,
    12: 1.3,
  }
  return seasonality[month] ?? 1
}

const weekdayFactor = (date: Date) => {
  const weekday = date.getUTCDay()
  return weekday === 0 || weekday === 6 ? 0.82 : 1
}

const isMissingRevenueDay = (date: Date, campaign: CampaignProfile) =>
  campaign.id === 'meta-remarketing-01' && toIsoDate(date) === '2026-07-09'

const isAnomalyDay = (date: Date, campaign: CampaignProfile) =>
  campaign.id === 'meta-awareness-01' && toIsoDate(date) === '2026-07-15'

const makeFact = (date: Date, campaign: CampaignProfile, campaignIndex: number): CampaignFact => {
  const signal = stableSignal(date, campaignIndex)
  const demandFactor = seasonalFactor(date) * weekdayFactor(date) * signal
  const anomalyFactor = isAnomalyDay(date, campaign) ? 2.6 : 1
  const spend = round(campaign.dailySpend * demandFactor * anomalyFactor)
  const impressions = round((spend / 1000) * 1250 * demandFactor)
  const clicks = round(impressions * campaign.ctr * signal)
  const missingRevenue = isMissingRevenueDay(date, campaign)
  const conversions = missingRevenue
    ? null
    : round(clicks * campaign.conversionRate * (isAnomalyDay(date, campaign) ? 0.25 : 1))
  const grossRevenue = conversions === null ? null : round(conversions * campaign.averageOrderValue * demandFactor)
  const discounts = grossRevenue === null ? null : round(grossRevenue * 0.045)
  const returns = grossRevenue === null ? null : round(grossRevenue * 0.022)
  const cancellations = grossRevenue === null ? null : round(grossRevenue * 0.011)
  const netRevenue = grossRevenue === null
    ? null
    : grossRevenue - (discounts ?? 0) - (returns ?? 0) - (cancellations ?? 0)
  const variableCosts = netRevenue === null ? null : round(netRevenue * campaign.variableCostRate)

  return {
    date: toIsoDate(date),
    monthKey: toIsoDate(date).slice(0, 7),
    platform: campaign.platform,
    campaignId: campaign.id,
    campaignName: campaign.name,
    objective: campaign.objective,
    funnelStage: campaign.funnelStage,
    spend,
    impressions,
    clicks,
    conversions,
    grossRevenue,
    discounts,
    returns,
    cancellations,
    variableCosts,
  }
}

const generateFacts = () => {
  const facts: CampaignFact[] = []
  const start = toDate(START_DATE)
  const end = toDate(DEMO_TODAY)

  for (const date = new Date(start); date <= end; date.setUTCDate(date.getUTCDate() + 1)) {
    CAMPAIGNS.forEach((campaign, index) => facts.push(makeFact(new Date(date), campaign, index)))
  }

  return facts
}

export const demoDataset: DemoDataset = {
  today: DEMO_TODAY,
  facts: generateFacts(),
}

export const campaignOptions = CAMPAIGNS.map(({ id, name }) => ({ id, name }))
