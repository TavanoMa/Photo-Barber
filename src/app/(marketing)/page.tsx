import CTA from "@/src/components/CTA";
import HeroLanding from "@/src/components/HeroLanding";
import Pricing from "@/src/components/Pricing";
import SolutionSection from "@/src/components/SolutionSection";

import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { supabaseAdmin } from "@/src/lib/supabase";
import OnboardingGate from "@/src/components/OnboardingGate";
import HeaderLanding from "@/src/components/HeaderLanding"

export default async function Home() {
  const session = await getServerSession(authOptions)

  let needsOnboarding = false

  if (session?.user?.email) {
    const { data } = await supabaseAdmin
      .from("users")
      .select("barbershop_name")
      .eq("email", session.user.email)
      .single()

    if (!data?.barbershop_name) {
      needsOnboarding = true
    }
  }

  return (
    <>
      <HeaderLanding
              mode="marketing"/>
      <OnboardingGate needsOnboarding={needsOnboarding} />

      <HeroLanding/>
      <SolutionSection/>
      <Pricing/>
      <CTA/>
    </>
  );
}