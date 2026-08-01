import { describe, expect, it } from 'vitest'
import { demoDataset } from '../data/demoData'
import {
  buildAlerts,
  factsInWindow,
  getPeriodWindow,
  getPreviousComparableWindow,
  variation,
} from './analysis'

describe('period analysis', () => {
  it('compares the same elapsed days against the previous month', () => {
    const current = getPeriodWindow('2026-07', demoDataset.today)
    const previous = getPreviousComparableWindow(current)

    expect(current.end).toBe('2026-07-22')
    expect(current.elapsedDays).toBe(22)
    expect(previous.monthKey).toBe('2026-06')
    expect(previous.elapsedDays).toBe(22)
    expect(factsInWindow(demoDataset.facts, current).every((fact) => fact.monthKey === '2026-07')).toBe(true)
  })

  it('keeps missing baselines explicit', () => {
    expect(variation({ value: 10, status: 'calculated' }, { value: 0, status: 'zero-denominator' }).status).toBe('no-baseline')
    expect(variation({ value: null, status: 'missing' }, { value: 10, status: 'calculated' }).status).toBe('missing')
  })

  it('creates alerts for target breaches and missing revenue', () => {
    const current = factsInWindow(demoDataset.facts, getPeriodWindow('2026-07', demoDataset.today)).filter(
      (fact) => fact.date === '2026-07-09' || fact.date === '2026-07-15',
    )
    const previous = factsInWindow(demoDataset.facts, getPreviousComparableWindow(getPeriodWindow('2026-07', demoDataset.today))).filter(
      (fact) => fact.campaignId === 'meta-awareness-01',
    )
    const alerts = buildAlerts(current, previous)

    expect(alerts.some((alert) => alert.title.includes('no disponible'))).toBe(true)
    expect(alerts.some((alert) => alert.title.includes('benchmark'))).toBe(true)
  })

  it('detects an investment scaling opportunity when ACOS is below target', () => {
    const current = factsInWindow(demoDataset.facts, getPeriodWindow('2026-07', demoDataset.today)).filter(
      (fact) => fact.campaignId === 'google-remarketing-01',
    )
    const previous = factsInWindow(demoDataset.facts, getPreviousComparableWindow(getPeriodWindow('2026-07', demoDataset.today))).filter(
      (fact) => fact.campaignId === 'google-remarketing-01',
    )
    const alerts = buildAlerts(current, previous)

    expect(alerts.some((alert) => alert.title === 'Oportunidad de escalar inversión')).toBe(true)
  })
})
