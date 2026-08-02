import { describe, expect, it } from 'vitest'
import { demoDataset } from '../data/demoData'
import { buildDashboardViewModel } from './viewModels'

const filters = { platform: 'all' as const, campaignId: 'all', objective: 'all' as const }

describe('dashboard view models', () => {
  it('keeps the selected month and comparable window aligned', () => {
    const view = buildDashboardViewModel(demoDataset.facts, demoDataset.today, '2026-07', filters)

    expect(view.currentWindow.end).toBe('2026-07-22')
    expect(view.previousWindow.end).toBe('2026-06-22')
    expect(view.currentFacts.every((fact) => fact.date <= view.currentWindow.end)).toBe(true)
    expect(view.campaignRows.length).toBeGreaterThan(0)
  })

  it('applies platform and campaign filters without changing metric formulas', () => {
    const view = buildDashboardViewModel(demoDataset.facts, demoDataset.today, '2026-07', {
      platform: 'Meta Ads',
      campaignId: 'meta-remarketing-01',
      objective: 'all',
    })

    expect(view.currentFacts.every((fact) => fact.platform === 'Meta Ads' && fact.campaignId === 'meta-remarketing-01')).toBe(true)
    expect(view.platformRows).toHaveLength(1)
  })

  it('preserves explicit missing states in filtered views', () => {
    const view = buildDashboardViewModel(demoDataset.facts, demoDataset.today, '2026-07', {
      platform: 'Meta Ads',
      campaignId: 'meta-remarketing-01',
      objective: 'Remarketing',
    })

    expect(view.currentAggregate.grossRevenue).not.toBeNull()
    expect(view.alerts.some((alert) => alert.title.includes('no disponible'))).toBe(true)
  })
})
