import { describe, expect, it } from 'vitest'
import { calculateMetrics, type AggregateFacts } from './metrics'

const completeFacts: AggregateFacts = {
  spend: 1000,
  impressions: 10000,
  clicks: 100,
  conversions: 10,
  grossRevenue: 10000,
  discounts: 500,
  returns: 200,
  cancellations: 100,
  variableCosts: 4600,
}

describe('calculateMetrics', () => {
  it('calculates acquisition, conversion and profitability metrics', () => {
    const metrics = calculateMetrics(completeFacts)

    expect(metrics.ctr.value).toBe(1)
    expect(metrics.cpc.value).toBe(10)
    expect(metrics.conversionRate.value).toBe(10)
    expect(metrics.cpa.value).toBe(100)
    expect(metrics.roas.value).toBe(10)
    expect(metrics.acos.value).toBe(10)
    expect(metrics.netRevenue.value).toBe(9200)
    expect(metrics.contributionMargin.value).toBe(4600)
    expect(metrics.marginAfterAds.value).toBe(3600)
    expect(metrics.breakEvenAcos.value).toBe(46)
  })

  it('does not invent a result when a required input is missing', () => {
    const metrics = calculateMetrics({ ...completeFacts, grossRevenue: null })

    expect(metrics.acos.status).toBe('missing')
    expect(metrics.netRevenue.status).toBe('missing')
    expect(metrics.breakEvenAcos.status).toBe('missing')
  })

  it('returns an explicit zero-denominator status', () => {
    const metrics = calculateMetrics({ ...completeFacts, clicks: 0, conversions: 0, spend: 0 })

    expect(metrics.cpc.status).toBe('zero-denominator')
    expect(metrics.cpa.status).toBe('zero-denominator')
    expect(metrics.roas.status).toBe('zero-denominator')
  })
})
