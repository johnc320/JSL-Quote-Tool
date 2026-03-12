import type { QuoteItem } from "../types/QuoteItem"
import type { Travel } from "../types/Travel"
import type { LabourTask } from "../types/LabourTask"

type Totals = {
  travel:number
  labour:number
  materials:number
  consumables:number
  misc:number
  grand:number
}

type Props = {
  mode:"simple"|"full"
  companyName:string
  customerName:string
  trips:Travel[]
  labour:LabourTask[]
  materials:QuoteItem[]
  consumables:QuoteItem[]
  misc:QuoteItem[]
  totals:Totals
  contingency:number
  finalTotal:number
  onBack:()=>void
}

export function QuotePreview({
  mode,
  companyName,
  customerName,
  trips,
  labour,
  materials,
  consumables,
  misc,
  totals,
  contingency,
  finalTotal,
  onBack
}:Props){

return(

<div className="quotePage">

<button onClick={onBack}>Back</button>
<button onClick={()=>window.print()}>Print / Save PDF</button>

<h1>{companyName}</h1>
<h2>Quote</h2>

<p>Customer: {customerName}</p>
<p>Date: {new Date().toLocaleDateString()}</p>

{mode==="full" && (

<>
<h3>Travel</h3>
{trips.map(x=>(
<div key={x.id}>
{x.destination} — {x.distanceKm} km × ${x.ratePerKm} × 2 = ${x.distanceKm*2*x.ratePerKm}
</div>
))}

<h3>Labour</h3>
{labour.map(x=>(
<div key={x.id}>
{x.day} — {x.task} — {x.hours}h × ${x.rate} = ${x.hours*x.rate}
</div>
))}

<h3>Materials</h3>
{materials.map(x=>(
<div key={x.material.id}>
{x.material.name} — {x.quantity} × ${x.cost} = ${x.quantity*x.cost}
</div>
))}

<h3>Consumables</h3>
{consumables.map(x=>(
<div key={x.material.id}>
{x.material.name} — {x.quantity} × ${x.cost} = ${x.quantity*x.cost}
</div>
))}

<h3>Miscellaneous</h3>
{misc.map(x=>(
<div key={x.material.id}>
{x.material.name} — {x.quantity} × ${x.cost} = ${x.quantity*x.cost}
</div>
))}
</>

)}

<hr/>

<h3>Totals</h3>

<div>Travel ${totals.travel.toFixed(2)}</div>
<div>Labour ${totals.labour.toFixed(2)}</div>
<div>Materials ${totals.materials.toFixed(2)}</div>
<div>Consumables ${totals.consumables.toFixed(2)}</div>
<div>Misc ${totals.misc.toFixed(2)}</div>

{contingency > 0 && (
  <div>Contingency Allowance ${contingency.toFixed(2)}</div>
)}

<hr/>

<h2>Total ${finalTotal.toFixed(2)}</h2>

<p>Thank you for your business.</p>

</div>

)
}