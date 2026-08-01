export type Platform = 'Google Ads' | 'Meta Ads'

export type FunnelStage = 'Adquisición' | 'Conversión' | 'Rentabilidad'

export type Objective =
  | 'Awareness'
  | 'Tráfico'
  | 'Prospecting'
  | 'Ventas'
  | 'Remarketing'

export type NullableNumber = number | null

export interface CampaignFact {
  date: string
  monthKey: string
  platform: Platform
  campaignId: string
  campaignName: string
  objective: Objective
  funnelStage: FunnelStage
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

export interface DemoDataset {
  today: string
  facts: CampaignFact[]
}
