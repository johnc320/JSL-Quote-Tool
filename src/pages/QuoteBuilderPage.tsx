import { useState } from "react"
import type { QuoteItem } from "../types/QuoteItem.ts"
import type { Travel } from "../types/Travel.ts"
import type { LabourTask } from "../types/LabourTask.ts"
import { QuotePreview } from "../components/QuotePreview.tsx"
import { ItemSection } from "../components/ItemSection.tsx"
import { supabase } from "../services/supabase.ts"
import { useEffect } from "react"



export function QuoteBuilderPage() {

  const [customerName, setCustomerName] = useState("")
  const [companyName, setCompanyName] = useState("Quote Number")
  const [jobDescription, setJobDescription] = useState("")

  const [showQuote, setShowQuote] = useState(false)
  const [quoteMode, setQuoteMode] = useState<"simple" | "full">("simple")

  // DATA LISTS
  const [trips, setTrips] = useState<Travel[]>([])
  const [labourTasks, setLabourTasks] = useState<LabourTask[]>([])
  const [materials, setMaterials] = useState<QuoteItem[]>([])
  const [consumables, setConsumables] = useState<QuoteItem[]>([])
  const [misc, setMisc] = useState<QuoteItem[]>([])

  // ENTRY FIELDS
  const [tripDestination, setTripDestination] = useState("")
  const [tripDistance, setTripDistance] = useState<number | "">("")
  const [tripRate, setTripRate] = useState<number | "">("")

  const [taskDay, setTaskDay] = useState("")
  const [taskName, setTaskName] = useState("")
  const [taskHours, setTaskHours] = useState<number | "">("")
  const [taskRate, setTaskRate] = useState<number | "">("")

  const [itemName, setItemName] = useState("")
  const [itemCost, setItemCost] = useState<number | "">("")
  const [itemMetric, setItemMetric] = useState("")
  const [itemQty, setItemQty] = useState<number | "">("")

  const [confidencePercent, setConfidencePercent] = useState<number | "">("")
  const [useContingency, setUseContingency] = useState(false)

  const [savedQuotes, setSavedQuotes] = useState<any[]>([])

  const [showSavedQuotes, setShowSavedQuotes] = useState(false)
  const [currentQuoteId, setCurrentQuoteId] = useState<string | null>(null)

  // ADD FUNCTIONS

  function addTrip() {
    if (!tripDestination) return

    setTrips([
      ...trips,
      {
        id: crypto.randomUUID(),
        destination: tripDestination,
        distanceKm: Number(tripDistance || 0),
        ratePerKm: Number(tripRate || 0)
      }
    ])

    setTripDestination("")
    setTripDistance("")
    setTripRate("")
  }

  function addLabourTask() {
    if (!taskName) return

    setLabourTasks([
      ...labourTasks,
      {
        id: crypto.randomUUID(),
        day: taskDay,
        task: taskName,
        hours: Number(taskHours || 0),
        rate: Number(taskRate || 0)
      }
    ])

    setTaskDay("")
    setTaskName("")
    setTaskHours("")
    setTaskRate("")
  }

  function addItem(setter: any, list: any[]) {
    if (!itemName) return

    setter([
      ...list,
      {
        id: crypto.randomUUID(),
        material: {
          id: crypto.randomUUID(),
          name: itemName,
          cost: Number(itemCost || 0),
          metric: itemMetric
        },
        quantity: Number(itemQty || 1),
        cost: Number(itemCost || 0)
      }
    ])

    setItemName("")
    setItemCost("")
    setItemMetric("")
    setItemQty("")
  }

  // REMOVE

  function removeItem(setter: any, list: any[], id: string) {
    setter(list.filter((x: any) => x.id !== id))
  }

  // REORDER

  function moveUp(list: any[], index: number, setter: any) {
    if (index === 0) return
    const newList = [...list]
    const temp = newList[index - 1]
    newList[index - 1] = newList[index]
    newList[index] = temp
    setter(newList)
  }

  function moveDown(list: any[], index: number, setter: any) {
    if (index === list.length - 1) return
    const newList = [...list]
    const temp = newList[index + 1]
    newList[index + 1] = newList[index]
    newList[index] = temp
    setter(newList)
  }

  async function saveQuote() {

  const quoteData = {
    trips,
    labourTasks,
    materials,
    consumables,
    misc
  }

  if (currentQuoteId) {

    // UPDATE EXISTING QUOTE

    const { error } = await supabase
      .from("quotes")
      .update({
        user_name: companyName,
        customer_name: customerName,
        job_description: jobDescription,
        data: quoteData
      })
      .eq("id", currentQuoteId)

    if (error) {
      console.error(error)
      return
    }

  } else {

    // CREATE NEW QUOTE

    const { error } = await supabase
      .from("quotes")
      .insert({
        user_name: companyName,
        customer_name: customerName,
        job_description: jobDescription,
        data: quoteData
      })

    if (error) {
      console.error(error)
      return
    }

  }

  loadQuotes()

}

  async function loadQuotes() {

    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
    } else {
      setSavedQuotes(data || [])
    }

  }

  useEffect(() => {
    loadQuotes()
  }, [])

  function openQuote(q: any) {

    setCurrentQuoteId(q.id)
    const data = q.data || {}

    setTrips(data.trips || [])
    setLabourTasks(data.labourTasks || [])
    setMaterials(data.materials || [])
    setConsumables(data.consumables || [])
    setMisc(data.misc || [])

   setCustomerName(q.customer_name || "")
  setCompanyName(q.user_name || "")
  setJobDescription(q.job_description || "")

  }

  function duplicateQuote(q: any) {

    openQuote(q)
    setCurrentQuoteId(null)

    alert("Quote duplicated. Save to create a new record.")

  }

  async function deleteQuote(id: string) {

    if (!confirm("Delete this quote?")) return

    await supabase
      .from("quotes")
      .delete()
      .eq("id", id)

    loadQuotes()

  }

  function newQuote() {

    if (!confirm("Start a new quote? Current work will be cleared.")) return

    setCustomerName("")

    setTrips([])
    setLabourTasks([])
    setMaterials([])
    setConsumables([])
    setMisc([])

    setConfidencePercent("")
    setUseContingency(false)

  }



  // TOTALS

  const travelTotal = trips.reduce((t, x) => t + x.distanceKm * 2 * x.ratePerKm, 0)
  const labourTotal = labourTasks.reduce((t, x) => t + x.hours * x.rate, 0)
  const materialsTotal = materials.reduce((t, x) => t + x.quantity * x.cost, 0)
  const consumablesTotal = consumables.reduce((t, x) => t + x.quantity * x.cost, 0)
  const miscTotal = misc.reduce((t, x) => t + x.quantity * x.cost, 0)

  const grandTotal =
    travelTotal +
    labourTotal +
    materialsTotal +
    consumablesTotal +
    miscTotal
  const contingencyValue =
    confidencePercent === ""
      ? 0
      : grandTotal * (Number(confidencePercent) / 100)

  const adjustedTotal = grandTotal + contingencyValue

  const finalTotal = useContingency ? adjustedTotal : grandTotal

  if (showQuote) {
    return (
      <QuotePreview
        mode={quoteMode}
        companyName={companyName}
        customerName={customerName}
        trips={trips}
        labour={labourTasks}
        materials={materials}
        consumables={consumables}
        misc={misc}
        totals={{
          travel: travelTotal,
          labour: labourTotal,
          materials: materialsTotal,
          consumables: consumablesTotal,
          misc: miscTotal,
          grand: grandTotal
        }}
        contingency={contingencyValue}
        finalTotal={finalTotal}
        onBack={() => setShowQuote(false)}
      />
    )
  }

  return (

    <div className="app-container">
      <h1>JSL Electrical Quote Tool</h1>
      {/* Saved Quotes Dashboard */}
      <div className="card">

        <div
          className="savedQuotesHeader"
          onClick={() => setShowSavedQuotes(!showSavedQuotes)}
        >

          <span className="arrow">
            {showSavedQuotes ? "▼" : "▶"}
          </span>

          <h2>Saved Quotes</h2>

        </div>

        {showSavedQuotes && (

          <div className="quotesTable">

            {savedQuotes.map(q => (

              <div key={q.id} className="quoteRow">

                <div className="quoteInfo">

                  <div className="quoteTitle">
                    {q.user_name || "Untitled Quote"}
                  </div>

                  <div className="quoteSubtitle">
                    {q.job_description || ""}
                  </div>

                  <div className="quoteDate">
                    {new Date(q.created_at).toLocaleDateString()}
                  </div>

                </div>

                <div className="quoteActions">

                  <button onClick={() => openQuote(q)}>Open</button>

                  <button onClick={() => duplicateQuote(q)}>Copy</button>

                  <button onClick={() => deleteQuote(q.id)}>Delete</button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>



        <button onClick={newQuote}>
          New Quote
        </button>

      </div>

      <div className="sheet">

        <h2>Quote Builder</h2>

        <div className="row">
          <input placeholder="Company Name"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)} />
          <input placeholder="Customer"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)} />
          <input
            placeholder="Job Description"
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
          />
        </div>

        {/* TRAVEL */}
        <div className="card">
          <h3>Travel</h3>

          <div className="grid4">
            <input placeholder="Destination" value={tripDestination}
              onChange={e => setTripDestination(e.target.value)} />

            <input placeholder="km" type="number"
              value={tripDistance}
              onChange={e => setTripDistance(e.target.value === "" ? "" : Number(e.target.value))} />

            <input placeholder="$ / km" type="number"
              value={tripRate}
              onChange={e => setTripRate(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>

          <button onClick={addTrip}>Add Trip</button>

          {trips.map((x, i) =>
            <div className="line" key={x.id}>
              <span><strong>Destination:</strong> {x.destination}</span>
              <span><strong>Distance:</strong> {x.distanceKm} km</span>
              <span><strong>Rate:</strong> ${x.ratePerKm}</span>
              <span><strong>Total:</strong> ${x.distanceKm * 2 * x.ratePerKm}</span>

              <div>
                <button onClick={() => removeItem(setTrips, trips, x.id)}>X</button>
                <button onClick={() => moveUp(trips, i, setTrips)}>↑</button>
                <button onClick={() => moveDown(trips, i, setTrips)}>↓</button>
              </div>
            </div>
          )}

          <div className="sectionTotal">Travel Total ${travelTotal}</div>
        </div>
        {/* LABOUR */}
        <div className="card">

          <h3>Labour</h3>

          <div className="grid4">

            <input
              placeholder="Day"
              value={taskDay}
              onChange={e => setTaskDay(e.target.value)}
            />

            <input
              placeholder="Task"
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
            />

            <input
              placeholder="Hours"
              type="number"
              value={taskHours}
              onChange={e => setTaskHours(e.target.value === "" ? "" : Number(e.target.value))}
            />

            <input
              placeholder="Rate"
              type="number"
              value={taskRate}
              onChange={e => setTaskRate(e.target.value === "" ? "" : Number(e.target.value))}
            />

          </div>

          <button onClick={addLabourTask}>Add Task</button>

          {labourTasks.map((x, i) =>

            <div className="line" key={x.id}>

              <span><strong>Day:</strong> {x.day}</span>
              <span><strong>Task:</strong> {x.task}</span>
              <span><strong>Hours:</strong> {x.hours}</span>
              <span><strong>Total:</strong> ${x.hours * x.rate}</span>

              <div className="row-actions">
                <button className="remove-button" onClick={() => removeItem(setLabourTasks, labourTasks, x.id)}>X</button>
                <button className="arrow-button" onClick={() => moveUp(labourTasks, i, setLabourTasks)}>↑</button>
                <button className="arrow-button" onClick={() => moveDown(labourTasks, i, setLabourTasks)}>↓</button>
              </div>

            </div>

          )}

          <div className="sectionTotal">Labour Total ${labourTotal}</div>

        </div>
        {/* MATERIAL SECTIONS */}

        <ItemSection
          title="Materials"
          items={materials}
          setItems={setMaterials}
          addItem={() => addItem(setMaterials, materials)}
          total={materialsTotal}
          moveUp={moveUp}
          moveDown={moveDown}
          removeItem={removeItem}
          entry={{ itemName, setItemName, itemCost, setItemCost, itemMetric, setItemMetric, itemQty, setItemQty }}
        />

        <ItemSection
          title="Consumables"
          items={consumables}
          setItems={setConsumables}
          addItem={() => addItem(setConsumables, consumables)}
          total={consumablesTotal}
          moveUp={moveUp}
          moveDown={moveDown}
          removeItem={removeItem}
          entry={{ itemName, setItemName, itemCost, setItemCost, itemMetric, setItemMetric, itemQty, setItemQty }}
        />

        <ItemSection
          title="Miscellaneous"
          items={misc}
          setItems={setMisc}
          addItem={() => addItem(setMisc, misc)}
          total={miscTotal}
          moveUp={moveUp}
          moveDown={moveDown}
          removeItem={removeItem}
          entry={{ itemName, setItemName, itemCost, setItemCost, itemMetric, setItemMetric, itemQty, setItemQty }}
        />

        <div className="card">

          <h3>Confidence / Contingency</h3>

          <div className="confidence-row">

            <label>Allowance %</label>

            <input
              type="number"
              placeholder="%"
              value={confidencePercent}
              onChange={(e) =>
                setConfidencePercent(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />

          </div>

          <div className="confidence-values">

            <div>Original Total: ${grandTotal.toFixed(2)}</div>

            <div>Contingency: ${contingencyValue.toFixed(2)}</div>

            <div>Adjusted Total: ${adjustedTotal.toFixed(2)}</div>

          </div>

          <div className="confidence-options">

            <label>
              <input
                type="radio"
                checked={!useContingency}
                onChange={() => setUseContingency(false)}
              />
              Use Original Total
            </label>

            <label>
              <input
                type="radio"
                checked={useContingency}
                onChange={() => setUseContingency(true)}
              />
              Include Allowance in Total
            </label>

          </div>

        </div>

        {/* TOTALS */}

        <div className="totals">

          <div>Travel ${travelTotal}</div>
          <div>Labour ${labourTotal}</div>
          <div>Materials ${materialsTotal}</div>
          <div>Consumables ${consumablesTotal}</div>
          <div>Misc ${miscTotal}</div>

          <hr />

          <div className="grand">Total ${finalTotal.toFixed(2)}</div>

        </div>

        <button onClick={saveQuote}>
          Save Quote
        </button>

        <div className="quoteButtons">
          <button onClick={() => { setQuoteMode("simple"); setShowQuote(true) }}>Generate Simple Quote</button>
          <button onClick={() => { setQuoteMode("full"); setShowQuote(true) }}>Generate Comprehensive Quote</button>
        </div>

      </div>

    </div>
  )
}