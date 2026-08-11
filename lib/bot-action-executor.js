/**
 * Bot Action Executor for TripNest
 * Parses structured [ACTION:command:param1:param2...] tags from AI responses
 * and executes corresponding state changes in TripContext and Navigation.
 */

export function parseAndExecuteBotActions(text, tripContext, onNavigate) {
  if (!text || typeof text !== "string") {
    return { cleanText: text || "", executedActions: [] }
  }

  const actionRegex = /\[ACTION:([^\]]+)\]/g
  const executedActions = []
  let match

  // Extract all actions from the response
  const actionTags = []
  while ((match = actionRegex.exec(text)) !== null) {
    actionTags.push(match[1])
  }

  // Remove [ACTION:...] tags from the final display text
  let cleanText = text.replace(actionRegex, "").trim()

  for (const tag of actionTags) {
    const parts = tag.split(":").map((p) => p.trim())
    const command = parts[0]?.toLowerCase()

    try {
      switch (command) {
        case "navigate": {
          const view = parts[1]?.toLowerCase()
          if (view && onNavigate) {
            onNavigate(view)
            executedActions.push(`🚀 Switched view to **${view.toUpperCase()}**`)
          }
          break
        }

        case "generate_trip":
        case "plan_trip": {
          const dest = parts[1] || tripContext.destination || "Goa"
          const days = parseInt(parts[2], 10) || 3
          if (tripContext.generateTripItinerary) {
            tripContext.generateTripItinerary(dest, days)
            if (onNavigate) onNavigate("itinerary")
            executedActions.push(`🗓️ Built **${days}-Day Trip to ${dest}**`)
          }
          break
        }

        case "add_spot": {
          const dayNum = parseInt(parts[1], 10) || 1
          const spotTitle = parts[2] || "New Activity"
          const spotCost = parseInt(parts[3], 10) || 500
          const category = parts[4] || "Activities"
          
          if (tripContext.addSpotToItinerary) {
            const newSpot = {
              title: spotTitle,
              desc: `Recommended by Boots`,
              cost: `₹${spotCost.toLocaleString()}`,
              numericCost: spotCost,
              category: category,
              type: category,
              time: "02:00 PM",
              openingHours: "10:00 AM - 08:00 PM"
            }
            tripContext.addSpotToItinerary(dayNum, newSpot)
            executedActions.push(`📍 Added **"${spotTitle}"** (₹${spotCost.toLocaleString()}) to Day ${dayNum}`)
          }
          break
        }

        case "remove_spot": {
          const spotName = parts[1]
          if (spotName && tripContext.removeSpotByName) {
            const removed = tripContext.removeSpotByName(spotName)
            if (removed) {
              executedActions.push(`🗑️ Removed **"${spotName}"** from itinerary`)
            } else {
              executedActions.push(`⚠️ Spot **"${spotName}"** not found in current itinerary`)
            }
          }
          break
        }

        case "set_budget": {
          const amount = parseInt(parts[1], 10)
          if (!isNaN(amount) && tripContext.setCustomTargetBudget) {
            tripContext.setCustomTargetBudget(amount)
            executedActions.push(`💰 Target Budget set to **₹${amount.toLocaleString()}**`)
          }
          break
        }

        case "override_category_budget":
        case "set_category_budget": {
          const cat = parts[1]
          const amount = parseInt(parts[2], 10)
          if (cat && !isNaN(amount) && tripContext.setBudgetCategoryOverride) {
            tripContext.setBudgetCategoryOverride(cat, amount)
            executedActions.push(`🏷️ Set **${cat}** budget allocation to **₹${amount.toLocaleString()}**`)
          }
          break
        }

        case "reset_category_budget": {
          const cat = parts[1]
          if (cat && tripContext.resetBudgetCategoryOverride) {
            tripContext.resetBudgetCategoryOverride(cat)
            executedActions.push(`🔄 Reset **${cat}** budget allocation to default`)
          }
          break
        }

        case "add_expense": {
          const title = parts[1] || "Expense"
          const amount = parseInt(parts[2], 10) || 0
          const cat = parts[3] || "Food & Dining"
          const paidBy = parts[4] || "You"
          if (tripContext.addActualExpense) {
            tripContext.addActualExpense({
              description: title,
              amount: amount,
              category: cat,
              paidBy: paidBy,
              date: new Date().toISOString().split("T")[0]
            })
            executedActions.push(`🧾 Recorded expense: **${title}** (₹${amount.toLocaleString()}) paid by ${paidBy}`)
          }
          break
        }

        case "set_tier":
        case "set_stay_tier": {
          const tier = parts[1] // Economy | Standard | Luxury
          if (tier && tripContext.setStayTier) {
            const normalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()
            tripContext.setStayTier(normalizedTier)
            executedActions.push(`🏨 Stay tier changed to **${normalizedTier}**`)
          }
          break
        }

        case "set_travelers": {
          const count = parseInt(parts[1], 10)
          if (!isNaN(count) && count > 0 && tripContext.setTravelers) {
            tripContext.setTravelers(count)
            executedActions.push(`👥 Group size updated to **${count} travelers**`)
          }
          break
        }

        case "set_days": {
          const dayCount = parseInt(parts[1], 10)
          if (!isNaN(dayCount) && dayCount > 0 && tripContext.setDays) {
            tripContext.setDays(dayCount)
            executedActions.push(`📅 Trip duration set to **${dayCount} days**`)
          }
          break
        }

        case "add_group_member": {
          const memberName = parts[1]
          if (memberName && tripContext.setGroupMembers && tripContext.groupMembers) {
            if (!tripContext.groupMembers.includes(memberName)) {
              tripContext.setGroupMembers([...tripContext.groupMembers, memberName])
              executedActions.push(`👤 Added **${memberName}** to group expense members`)
            }
          }
          break
        }

        case "save_trip": {
          if (tripContext.saveCurrentTrip) {
            const saved = tripContext.saveCurrentTrip()
            if (saved) {
              executedActions.push(`💾 Saved current trip to **Passport & Saved Trips**`)
            }
          }
          break
        }

        case "open_saved_trips":
        case "view_saved_trips": {
          if (tripContext.setSavedTripsModalOpen) {
            tripContext.setSavedTripsModalOpen(true)
            executedActions.push(`🗂️ Opened **Saved Trips & Offline Passports**`)
          }
          break
        }

        case "compare_package": {
          const pkgId = parts[1]
          if (pkgId && tripContext.addPackageToCompare) {
            const pkgObj = {
              id: pkgId,
              provider: parts[2] || "Tour Operator",
              name: parts[3] || `${tripContext.destination || "Trip"} Package`,
              price: `₹${(parts[4] || 15000).toLocaleString()}`,
              numericPrice: parseInt(parts[4], 10) || 15000,
              duration: `${tripContext.days || 3} Days`,
              highlights: "Flight, Hotel & Sightseeing Included"
            }
            tripContext.addPackageToCompare(pkgObj)
            if (onNavigate) onNavigate("packages")
            executedActions.push(`📦 Added package to **Comparison Workspace**`)
          }
          break
        }

        default:
          break
      }
    } catch (e) {
      console.error("Failed to execute bot action:", tag, e)
    }
  }

  return { cleanText, executedActions }
}
