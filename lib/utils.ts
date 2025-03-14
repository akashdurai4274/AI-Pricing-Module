import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to format numbers with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Utility function to calculate price between tiers
export function interpolatePrice(
  value: number,
  lowerTier: { value: number; price: number },
  upperTier: { value: number; price: number },
): number {
  const ratio = (value - lowerTier.value) / (upperTier.value - lowerTier.value)
  return lowerTier.price + ratio * (upperTier.price - lowerTier.price)
}

