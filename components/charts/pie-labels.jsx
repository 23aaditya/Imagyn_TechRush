"use client"

import { usePieStable, usePieHover } from "./pie-context"

export function PieLabels({
  hoverColor = "#513229",
  darkHoverColor = "#ffffff",
  labelRadiusOffset = 28,
  onHoverChange
}) {
  // Detect dark mode at render time via the class on <html>
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
  const resolvedHoverColor = isDark ? darkHoverColor : hoverColor
  const { arcs, outerRadius } = usePieStable()
  const { hoveredIndex } = usePieHover()

  if (!arcs || arcs.length === 0) return null

  const labelRadius = outerRadius + labelRadiusOffset

  return (
    <g className="pie-labels-group">
      {arcs.map((arc, index) => {
        const isHovered = hoveredIndex === index
        const midAngle = (arc.startAngle + arc.endAngle) / 2

        // Exact d3-shape radial coordinate conversion:
        // Angle 0 is at 12 o'clock, increasing clockwise
        const dx = Math.sin(midAngle)
        const dy = -Math.cos(midAngle)

        const x = dx * labelRadius
        const y = dy * labelRadius

        let textAnchor = "middle"
        if (dx > 0.15) textAnchor = "start"
        else if (dx < -0.15) textAnchor = "end"

        let dyVal = "0.35em"
        if (dy > 0.4) dyVal = "0.75em"
        else if (dy < -0.4) dyVal = "-0.2em"

        const label = arc.data?.label || arc.data?.id || ""

        return (
          <text
            key={`pie-label-${arc.data?.id || index}`}
            x={x}
            y={y}
            dy={dyVal}
            textAnchor={textAnchor}
            className="font-bold text-xs font-sans transition-all duration-200 pointer-events-auto cursor-pointer select-none"
            onMouseEnter={() => onHoverChange && onHoverChange(index)}
            onMouseLeave={() => onHoverChange && onHoverChange(null)}
            style={{
              fill: isHovered ? resolvedHoverColor : "currentColor",
              fontSize: isHovered ? "16.5px" : "15px",
              fontWeight: isHovered ? 900 : 750,
            }}
          >
            {label}
          </text>
        )
      })}
    </g>
  )
}
