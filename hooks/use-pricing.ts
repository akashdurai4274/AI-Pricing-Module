"use client"

import { useState, useEffect } from "react"
import { USER_TIER_PRICES } from "@/lib/pricing-config"

interface UsePricingProps {
  initialUsers?: number
  initialBillingCycle?: "monthly" | "yearly"
  initialBusinessType?: "b2c" | "b2b"
}

export function usePricing({
  initialUsers = 1000,
  initialBillingCycle = "monthly",
  initialBusinessType = "b2c",
}: UsePricingProps = {}) {
  const [activeUsers, setActiveUsers] = useState(initialUsers)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(initialBillingCycle)
  const [businessType, setBusinessType] = useState<"b2c" | "b2b">(initialBusinessType)

  const [essentialsPrice, setEssentialsPrice] = useState<number | null>(null)
  const [professionalPrice, setProfessionalPrice] = useState<number | null>(null)

  useEffect(() => {
    // Find the appropriate pricing tier based on active users
    const currentTier = USER_TIER_PRICES.find(
      (tier, index) => activeUsers <= tier.users || index === USER_TIER_PRICES.length - 1,
    )

    // Apply yearly discount (20%)
    const yearlyMultiplier = billingCycle === "yearly" ? 0.8 : 1

    setEssentialsPrice(currentTier?.essentialsPrice ? currentTier.essentialsPrice * yearlyMultiplier : null)

    setProfessionalPrice(currentTier?.professionalPrice ? currentTier.professionalPrice * yearlyMultiplier : null)
  }, [activeUsers, billingCycle, businessType])

  return {
    activeUsers,
    setActiveUsers,
    billingCycle,
    setBillingCycle,
    businessType,
    setBusinessType,
    essentialsPrice,
    professionalPrice,
  }
}

