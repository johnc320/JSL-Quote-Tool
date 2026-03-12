import { QuoteItem } from "./QuoteItem.ts"

export interface Quote {
  id: string
  customerName: string
  description?: string
  labourHours: number
  hourlyRate: number
  calloutFee: number
  materials: QuoteItem[]
  total: number
  createdAt: string
}