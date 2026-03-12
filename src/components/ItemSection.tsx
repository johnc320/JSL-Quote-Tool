import type { QuoteItem } from "../types/QuoteItem"

type Props = {
  title:string
  items:QuoteItem[]
  setItems:any
  addItem:()=>void
  total:number
  moveUp:any
  moveDown:any
  removeItem:any
  entry:any
}

export function ItemSection({
  title,
  items,
  setItems,
  addItem,
  total,
  moveUp,
  moveDown,
  removeItem,
  entry
}:Props){

return(

<div className="card">

<h3>{title}</h3>

<div className="grid4">

<input
placeholder="Item"
value={entry.itemName}
onChange={(e)=>entry.setItemName(e.target.value)}
/>

<input
type="number"
placeholder="Cost"
value={entry.itemCost}
onChange={(e)=>entry.setItemCost(Number(e.target.value))}
 />

<input
placeholder="Metric"
value={entry.itemMetric}
onChange={(e)=>entry.setItemMetric(e.target.value)}
 />

<input
type="number"
placeholder="Qty"
value={entry.itemQty}
onChange={(e)=>entry.setItemQty(Number(e.target.value))}
 />

</div>

<button onClick={addItem}>Add {title}</button>

{items.map((x,i)=>(
<div className="line" key={x.material.id}>

<span><strong>Item:</strong> {x.material.name}</span>

<span>
<strong>Quantity:</strong> {x.quantity} {x.material.metric}
</span>

<span>
<strong>Cost:</strong> ${x.cost}
</span>

<span>
<strong>Total:</strong> ${x.quantity * x.cost}
</span>

<div className="row-actions">
<button className="remove-button" onClick={()=>removeItem(setItems,items,x.material.id)}>X</button>
<button className="arrow-button" onClick={()=>moveUp(items,i,setItems)}>↑</button>
<button className="arrow-button" onClick={()=>moveDown(items,i,setItems)}>↓</button>
</div>

</div>
))}

<div className="sectionTotal">{title} Total ${total}</div>

</div>

)
}