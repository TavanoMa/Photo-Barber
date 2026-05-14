import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabaseAdmin } from "@/src/lib/supabase"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
  async signIn({ user }) {
    const { email, name, image } = user

    await supabaseAdmin
      .from("users")
      .upsert({
        email,
        name,
        avatar_url: image,
      }, { onConflict: "email" })

    return true
  },

  // roda sempre que o JWT é criado/atualizado
  async jwt({ token }) {
    if (!token.email) return token

    const { data } = await supabaseAdmin
      .from("users")
      .select("has_active_subscription, slug")
      .eq("email", token.email)
      .single()

    if (data) {
      token.hasActiveSub = data.has_active_subscription
      token.slug = data.slug
    }

    return token
  },

  // copia dados do token → session (lado cliente)
  async session({ session, token }) {
    session.user.hasActiveSub = token.hasActiveSub as boolean
    session.user.slug = token.slug as string
    return session
  },

  // redirecionamento pós login
  async redirect({ url, baseUrl }) {
    // se for redirect interno do next-auth, usa ele
    if (url.startsWith("/")) return `${baseUrl}${url}`

    return baseUrl
  },
},
}