"use client"

import { signOut } from "next-auth/react"
import { ReactNode } from "react"

type Props = {
  className?: string
  children?: ReactNode
  callbackUrl?: string
}

export default function LogoutButton({
  className,
  children = "Sair",
  callbackUrl = "/",
}: Props) {
  return (
    <button
      onClick={() => signOut({ callbackUrl })}
      className={className}
    >
      {children}
    </button>
  )
}