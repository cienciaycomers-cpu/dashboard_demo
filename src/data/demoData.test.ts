import { describe, expect, it } from 'vitest'
import { demoDataset } from './demoData'

describe('demoDataset', () => {
  it('covers the approved 12-month window through the demo current date', () => {
    const dates = demoDataset.facts.map((fact) => fact.date)

    expect(demoDataset.today).toBe('2026-07-22')
    expect(Math.min(...dates.map((date) => Date.parse(date)))).toBe(Date.parse('2025-08-01'))
    expect(Math.max(...dates.map((date) => Date.parse(date)))).toBe(Date.parse('2026-07-22'))
    expect(new Set(demoDataset.facts.map((fact) => fact.monthKey)).size).toBe(12)
  })

  it('uses only demo identifiers and keeps missing revenue explicit', () => {
    expect(demoDataset.facts.every((fact) => !/47street|real|client/i.test(fact.campaignName))).toBe(true)

    const missingRevenueRows = demoDataset.facts.filter(
      (fact) => fact.date === '2026-07-09' && fact.campaignId === 'meta-remarketing-01',
    )

    expect(missingRevenueRows).toHaveLength(1)
    expect(missingRevenueRows[0].grossRevenue).toBeNull()
    expect(missingRevenueRows[0].conversions).toBeNull()
  })

  it('includes a controlled spend anomaly for alert validation', () => {
    const anomaly = demoDataset.facts.find(
      (fact) => fact.date === '2026-07-15' && fact.campaignId === 'meta-awareness-01',
    )

    expect(anomaly).toBeDefined()
    expect(anomaly?.spend).toBeGreaterThan(30000)
    expect(anomaly?.conversions).toBeGreaterThanOrEqual(0)
  })
})
