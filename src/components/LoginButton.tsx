"use client"

import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"
import { ReactNode } from "react"
import { useRouter } from "next/navigation"

type Props = {
  className?: string
  children?: ReactNode
}

export default function LoginButton({ className, children = "Entrar" }: Props) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // após login → decide para onde ir
  useEffect(() => {
    if (status !== "authenticated") return

    if (session.user.hasActiveSub && session.user.slug) {
      router.push(`/${session.user.slug}`)
    }
  }, [session, status])

  return (
    <button onClick={() => signIn("google")} className={className}>
      {children}
    </button>
  )
}