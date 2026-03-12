import { calculateQuoteTotal } from "../services/quoteCalculator"

const total = calculateQuoteTotal(
  3,
  110,
  90,
  [
    {
      material: { id: "1", name: "Power Point", cost: 12, metric: "each" },
      quantity: 2,
      cost: 12
    },
    {
      material: { id: "2", name: "Cable", cost: 3, metric: "m" },
      quantity: 10,
      cost: 3
    }
  ]
)

console.log("Quote total:", total)