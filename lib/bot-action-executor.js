/**
 * Bot Action Executor for TripNest
 * Parses structured [ACTION:command:param1:param2...] tags from AI responses
 * and executes corresponding state changes in TripContext and Navigation.
 */

export function parseAndExecuteBotActions(text, tripContext, onNavigate) {
  if (!text || typeof text !== "string") {
    return { cleanText: text || "", executedActions: [], planPreview: null }
  }

  const actionRegex = /\[ACTION:([^\]]+)\]/g
  const executedActions = []
  let planPreview = null
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

        case "plan_trip_preview": {
          const dest = parts[1] || "Goa"
          const days = parseInt(parts[2], 10) || 3
          const tier = parts[3] || "Standard"
          const startDate = parts[4] || "2026-08-15"
          const endDate = parts[5] || "2026-08-17"
          planPreview = {
            destination: dest,
            days,
            tier,
            startDate,
            endDate
          }
          if (tripContext.generateTripItinerary) {
            tripContext.generateTripItinerary(dest, days)
            if (onNavigate) onNavigate("itinerary")
            executedActions.push(`🗓️ Built **${days}-Day Custom Itinerary for ${dest}**`)
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
          const baseLat = tripContext.activeStay?.lat || tripContext.baseStay?.lat || 15.5553
          const baseLng = tripContext.activeStay?.lng || tripContext.baseStay?.lng || 73.7517
          const lat = parseFloat(parts[5]) || (baseLat + (Math.random() - 0.5) * 0.04)
          const lng = parseFloat(parts[6]) || (baseLng + (Math.random() - 0.5) * 0.04)
          
          if (tripContext.addSpotToItinerary) {
            const newSpot = {
              title: spotTitle,
              desc: `Recommended by Voice Assistant`,
              cost: `₹${spotCost.toLocaleString()}`,
              numericCost: spotCost,
              category: category,
              type: category,
              time: "02:00 PM",
              openingHours: "10:00 AM - 08:00 PM",
              lat,
              lng
            }
            tripContext.addSpotToItinerary(dayNum - 1, newSpot)
            if (tripContext.setMapMode) tripContext.setMapMode("itinerary")
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

        case "remove_day":
        case "delete_day": {
          const dayNum = parseInt(parts[1], 10) || 1
          if (tripContext.removeDayFromItinerary) {
            const removed = tripContext.removeDayFromItinerary(dayNum)
            if (removed) {
              executedActions.push(`🗑️ Removed **Day ${dayNum}** from itinerary planner`)
            } else {
              executedActions.push(`⚠️ Day ${dayNum} not found in current itinerary`)
            }
          }
          break
        }

        case "restore_day": {
          if (tripContext.restoreLastRemovedDay) {
            const restored = tripContext.restoreLastRemovedDay()
            if (restored) {
              executedActions.push(`↩️ Restored removed Day back to its exact original position`)
            } else if (tripContext.addDayToItinerary) {
              tripContext.addDayToItinerary()
              executedActions.push(`➕ Added a new Day to itinerary planner`)
            }
          }
          break
        }

        case "add_day": {
          if (tripContext.lastRemovedDayState && tripContext.restoreLastRemovedDay) {
            tripContext.restoreLastRemovedDay()
            executedActions.push(`↩️ Restored removed Day back to its exact original position`)
          } else if (tripContext.addDayToItinerary) {
            tripContext.addDayToItinerary()
            executedActions.push(`➕ Added a new Day to itinerary planner`)
          }
          break
        }

        case "swap_days": {
          const d1 = parseInt(parts[1], 10) || 1
          const d2 = parseInt(parts[2], 10) || 2
          if (tripContext.swapDays) {
            tripContext.swapDays(d1, d2)
            executedActions.push(`🔀 Swapped Day ${d1} and Day ${d2} in itinerary planner`)
          }
          break
        }

        case "move_spot": {
          const spotTitle = parts[1]
          const targetDayNum = parseInt(parts[2], 10) || 1
          if (spotTitle && tripContext.moveSpotToDay) {
            const moved = tripContext.moveSpotToDay(spotTitle, targetDayNum)
            if (moved) {
              executedActions.push(`📍 Moved **"${spotTitle}"** to Day ${targetDayNum}`)
            } else {
              executedActions.push(`⚠️ Spot **"${spotTitle}"** not found in itinerary`)
            }
          }
          break
        }

        case "replace_spot": {
          const oldTitle = parts[1]
          const newTitle = parts[2] || "New Activity"
          const newCost = parseInt(parts[3], 10) || 500
          const category = parts[4] || "Activities"
          if (oldTitle && tripContext.replaceSpot) {
            const replaced = tripContext.replaceSpot(oldTitle, {
              title: newTitle,
              desc: `Replaced via Boots AI`,
              cost: `₹${newCost.toLocaleString()}`,
              numericCost: newCost,
              category
            })
            if (replaced) {
              executedActions.push(`🔄 Replaced **"${oldTitle}"** with **"${newTitle}"** (₹${newCost.toLocaleString()})`)
            }
          }
          break
        }

        case "undo": {
          if (tripContext.undoLastAction) {
            const undone = tripContext.undoLastAction()
            if (undone) {
              executedActions.push(`↩️ Undid last itinerary change`)
            } else {
              executedActions.push(`⚠️ Nothing to undo`)
            }
          }
          break
        }

        case "swap_spots": {
          const day1 = (parseInt(parts[1], 10) || 1) - 1
          const idx1 = (parseInt(parts[2], 10) || 1) - 1
          const day2 = (parseInt(parts[3], 10) || 1) - 1
          const idx2 = (parseInt(parts[4], 10) || 1) - 1

          if (tripContext.swapSpots) {
            tripContext.swapSpots(day1, idx1, day2, idx2)
            executedActions.push(`🔄 Swapped activities between Day ${day1 + 1} & Day ${day2 + 1}`)
          }
          break
        }

        case "reorder_spots": {
          const dayNum = (parseInt(parts[1], 10) || 1) - 1
          const oldIdx = (parseInt(parts[2], 10) || 1) - 1
          const newIdx = (parseInt(parts[3], 10) || 1) - 1

          if (tripContext.reorderDayActivities) {
            tripContext.reorderDayActivities(dayNum, oldIdx, newIdx)
            executedActions.push(`🔀 Reordered activities on Day ${dayNum + 1}`)
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
              title: title,
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

        // ═══════════════════════════════════════════════════════════════
        // GEOGRAPHIC INTELLIGENCE — MAP & STAY ACTIONS
        // ═══════════════════════════════════════════════════════════════

        case "set_stay": {
          const stayName = parts[1] || "My Hotel"
          const lat = parseFloat(parts[2])
          const lng = parseFloat(parts[3])
          if (tripContext.setActiveStay && !isNaN(lat) && !isNaN(lng)) {
            tripContext.setActiveStay({
              name: stayName,
              lat,
              lng,
              address: parts[4] || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
            })
            executedActions.push(`🏨 Set stay to **"${stayName}"** at (${lat.toFixed(4)}, ${lng.toFixed(4)})`)
          } else if (tripContext.setActiveStay && stayName) {
            // If no coordinates, just set the name (user can pin on map)
            executedActions.push(`🏨 Stay name set to **"${stayName}"** — pin location on the map`)
          }
          break
        }

        case "search_nearby": {
          const category = (parts[1] || "cafes").toLowerCase()
          const radius = parseInt(parts[2], 10) || 5000
          if (tripContext.setActiveDiscoveryCategory) {
            tripContext.setActiveDiscoveryCategory(category)
          }
          if (tripContext.setDiscoveryRadius && radius) {
            tripContext.setDiscoveryRadius(radius)
          }
          if (tripContext.setMapMode) {
            tripContext.setMapMode("discovery")
          }
          executedActions.push(`🔍 Searching nearby **${category}** within **${(radius / 1000).toFixed(0)}km** radius`)
          break
        }

        case "show_map_mode": {
          const mode = (parts[1] || "discovery").toLowerCase()
          if (tripContext.setMapMode && (mode === "discovery" || mode === "itinerary")) {
            tripContext.setMapMode(mode)
            executedActions.push(`🗺️ Map switched to **${mode === "discovery" ? "Discovery" : "Itinerary Route"}** mode`)
          }
          break
        }

        case "set_discovery_radius": {
          const radius = parseInt(parts[1], 10)
          if (!isNaN(radius) && radius > 0 && tripContext.setDiscoveryRadius) {
            tripContext.setDiscoveryRadius(radius)
            executedActions.push(`📏 Discovery radius set to **${(radius / 1000).toFixed(0)}km**`)
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

  return { cleanText, executedActions, planPreview }
}
