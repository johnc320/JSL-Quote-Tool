import { Material } from "./Material.ts"

export interface QuoteItem {
  material: Material
  quantity: number
  cost: number
}