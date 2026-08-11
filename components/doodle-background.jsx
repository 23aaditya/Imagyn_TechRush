"use client"

import React from "react"

export function DoodleBackground({ className = "" }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 select-none ${className}`}>
      <svg
        className="w-full h-full opacity-[0.18] dark:opacity-[0.14] text-foreground transition-opacity duration-300"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="travel-doodles-pattern"
            width="320"
            height="320"
            patternUnits="userSpaceOnUse"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Airplane & Dotted Arc */}
              <g transform="translate(30, 20) scale(0.7)">
                <path d="M 0 0 Q 30 -20 60 0 T 120 -10" strokeDasharray="3 4" strokeWidth="1" />
                <path d="M 120 -10 L 135 -15 L 130 -5 L 140 0 L 128 5 L 125 12 L 120 7 L 115 10 Z" fill="currentColor" fillOpacity="0.1" />
              </g>

              {/* Compass Rose */}
              <g transform="translate(220, 40) scale(0.6)">
                <circle cx="20" cy="20" r="18" />
                <path d="M 20 2 L 24 16 L 38 20 L 24 24 L 20 38 L 16 24 L 2 20 L 16 16 Z" />
              </g>

              {/* Palm Tree */}
              <g transform="translate(140, 90) scale(0.65)">
                <path d="M 20 40 Q 15 25 20 10" strokeWidth="2" />
                <path d="M 20 10 Q 5 0 -5 10 M 20 10 Q 35 0 45 10 M 20 10 Q 10 -10 5 -20 M 20 10 Q 30 -10 35 -20 M 20 10 Q 0 15 -10 25 M 20 10 Q 40 15 50 25" />
              </g>

              {/* Sunglasses */}
              <g transform="translate(20, 160) scale(0.6)">
                <path d="M 5 10 Q 15 0 25 10 L 25 20 Q 15 25 5 20 Z" fill="currentColor" fillOpacity="0.08" />
                <path d="M 35 10 Q 45 0 55 10 L 55 20 Q 45 25 35 20 Z" fill="currentColor" fillOpacity="0.08" />
                <path d="M 25 12 Q 30 8 35 12" />
                <path d="M 5 12 L 0 5 M 55 12 L 60 5" />
              </g>

              {/* Hot Air Balloon */}
              <g transform="translate(240, 180) scale(0.55)">
                <path d="M 20 0 C 35 0 40 20 25 32 L 15 32 C 0 20 5 0 20 0 Z" fill="currentColor" fillOpacity="0.05" />
                <path d="M 17 32 L 17 38 M 23 32 L 23 38" />
                <rect x="15" y="38" width="10" height="7" rx="1" />
                <path d="M 20 0 L 20 32 M 10 5 C 15 15 15 25 12 32 M 30 5 C 25 15 25 25 28 32" strokeDasharray="2 2" />
              </g>

              {/* Passport / Journal */}
              <g transform="translate(120, 240) scale(0.6)">
                <rect x="0" y="0" width="28" height="36" rx="3" />
                <circle cx="14" cy="14" r="6" />
                <path d="M 8 14 H 20 M 14 8 V 20" strokeWidth="1" />
                <line x1="5" y1="26" x2="23" y2="26" strokeWidth="1" />
              </g>

              {/* Camera */}
              <g transform="translate(30, 260) scale(0.6)">
                <rect x="0" y="8" width="36" height="24" rx="4" />
                <path d="M 10 8 L 13 3 H 23 L 26 8" />
                <circle cx="18" cy="20" r="7" />
                <circle cx="28" cy="13" r="1.5" fill="currentColor" />
              </g>

              {/* Mountain Peaks */}
              <g transform="translate(180, 150) scale(0.55)">
                <path d="M 0 30 L 20 5 L 40 30 Z" />
                <path d="M 15 11.25 L 20 16 L 25 11.25" fill="currentColor" fillOpacity="0.1" />
                <path d="M 25 30 L 40 10 L 55 30 Z" />
              </g>

              {/* Sparkles / Stars */}
              <g transform="translate(100, 40) scale(0.5)">
                <path d="M 10 0 L 12 7 L 19 9 L 12 11 L 10 18 L 8 11 L 1 9 L 8 7 Z" fill="currentColor" fillOpacity="0.15" />
              </g>
              <g transform="translate(280, 120) scale(0.4)">
                <path d="M 10 0 L 12 7 L 19 9 L 12 11 L 10 18 L 8 11 L 1 9 L 8 7 Z" fill="currentColor" fillOpacity="0.15" />
              </g>
              <g transform="translate(200, 280) scale(0.45)">
                <path d="M 10 0 L 12 7 L 19 9 L 12 11 L 10 18 L 8 11 L 1 9 L 8 7 Z" fill="currentColor" fillOpacity="0.15" />
              </g>

              {/* Dotted Flight Path 2 */}
              <g transform="translate(140, 10) scale(0.8)">
                <path d="M 0 20 C 40 -10 60 50 100 20" strokeDasharray="3 4" strokeWidth="1" />
              </g>
            </g>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#travel-doodles-pattern)" />
      </svg>
    </div>
  )
}
