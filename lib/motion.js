"use client"

// TripNest Motion Tokens & Easing Standards
export const EASE_TRAVEL = [0.25, 1, 0.5, 1] // Smooth cinematic travel easing
export const EASE_IN_OUT = [0.4, 0, 0.2, 1]

export const DURATION_MICRO = 0.35      // 300–400ms: Hover, buttons, small UI
export const DURATION_CONTENT = 0.55    // 400–700ms: Cards entering, section changes
export const DURATION_SIGNATURE = 0.85  // 600–1000ms: Journey line, image morph, coordinate reveal

// Motion Variant Presets
export const fadeInTravel = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_CONTENT, ease: EASE_TRAVEL }
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: DURATION_MICRO, ease: EASE_IN_OUT }
  }
}
