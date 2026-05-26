"use client"

import { useEffect, useState } from "react"

export function useUser() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch("/api/me")
      .then(r => r.json())
      .then(setUser)
  }, [])

  return user
}