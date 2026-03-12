import type { QuoteItem } from "../types/QuoteItem.ts"

export function calculateMaterialsTotal(items: QuoteItem[]): number {
  return items.reduce((sum, item) => {
    return sum + item.cost * item.quantity
  }, 0)
}

export function calculateLabourTotal(
  labourHours: number,
  hourlyRate: number
): number {
  return labourHours * hourlyRate
}

export function calculateQuoteTotal(
  labourHours: number,
  hourlyRate: number,
  calloutFee: number,
  items: QuoteItem[]
): number {

  const labour = calculateLabourTotal(labourHours, hourlyRate)

  const materials = calculateMaterialsTotal(items)

  return labour + materials + calloutFee
}