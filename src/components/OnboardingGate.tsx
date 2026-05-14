"use client"

import { useState } from "react"
import OnboardingModal from "./OnboardingModal"

export default function OnboardingGate({ needsOnboarding }: { needsOnboarding: boolean }) {
  const [open, setOpen] = useState(needsOnboarding)

  if (!needsOnboarding) return null

  return <OnboardingModal isOpen={open} onClose={() => setOpen(false)} />
}