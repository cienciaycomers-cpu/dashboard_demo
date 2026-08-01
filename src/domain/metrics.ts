import type { CampaignFact, NullableNumber } from './types'

export type MetricStatus = 'calculated' | 'missing' | 'zero-denominator'

export interface MetricValue {
  value: number | null
  status: MetricStatus
}

export interface AggregateFacts {
  spend: number
  impressions: number
  clicks: NullableNumber
  conversions: NullableNumber
  grossRevenue: NullableNumber
  discounts: NullableNumber
  returns: NullableNumber
  cancellations: NullableNumber
  variableCosts: NullableNumber
}

export interface DerivedMetrics {
  ctr: MetricValue
  cpc: MetricValue
  conversionRate: MetricValue
  cpa: MetricValue
  roas: MetricValue
  acos: MetricValue
  netRevenue: MetricValue
  contributionMargin: MetricValue
  marginAfterAds: MetricValue
  breakEvenAcos: MetricValue
}

export const ACOS_TARGET = 10

export const sumNullable = (values: NullableNumber[]): NullableNumber => {
  const present = values.filter((value): value is number => value !== null)
  return present.length === 0 ? null : present.reduce((sum, value) => sum + value, 0)
}

export const aggregateFacts = (facts: CampaignFact[]): AggregateFacts => ({
  spend: facts.reduce((sum, fact) => sum + fact.spend, 0),
  impressions: facts.reduce((sum, fact) => sum + fact.impressions, 0),
  clicks: sumNullable(facts.map((fact) => fact.clicks)),
  conversions: sumNullable(facts.map((fact) => fact.conversions)),
  grossRevenue: sumNullable(facts.map((fact) => fact.grossRevenue)),
  discounts: sumNullable(facts.map((fact) => fact.discounts)),
  returns: sumNullable(facts.map((fact) => fact.returns)),
  cancellations: sumNullable(facts.map((fact) => fact.cancellations)),
  variableCosts: sumNullable(facts.map((fact) => fact.variableCosts)),
})

const calculated = (value: number): MetricValue => ({ value, status: 'calculated' })

const missing = (): MetricValue => ({ value: null, status: 'missing' })

const safeRatio = (numerator: NullableNumber, denominator: NullableNumber, multiplier = 1): MetricValue => {
  if (numerator === null || denominator === null) return missing()
  if (denominator === 0) return { value: null, status: 'zero-denominator' }
  return calculated((numerator / denominator) * multiplier)
}

export const calculateMetrics = (input: AggregateFacts): DerivedMetrics => {
  const netRevenue = input.grossRevenue === null
    || input.discounts === null
    || input.returns === null
    || input.cancellations === null
    ? missing()
    : calculated(input.grossRevenue - input.discounts - input.returns - input.cancellations)

  const contributionMargin = netRevenue.value === null || input.variableCosts === null
    ? missing()
    : calculated(netRevenue.value - input.variableCosts)

  const marginAfterAds = contributionMargin.value === null
    ? missing()
    : calculated(contributionMargin.value - input.spend)

  return {
    ctr: safeRatio(input.clicks, input.impressions, 100),
    cpc: safeRatio(input.spend, input.clicks),
    conversionRate: safeRatio(input.conversions, input.clicks, 100),
    cpa: safeRatio(input.spend, input.conversions),
    roas: safeRatio(input.grossRevenue, input.spend),
    acos: safeRatio(input.spend, input.grossRevenue, 100),
    netRevenue,
    contributionMargin,
    marginAfterAds,
    breakEvenAcos: safeRatio(contributionMargin.value, input.grossRevenue, 100),
  }
}
