"use client"
import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import DynamicPricingBar from "./dynamic-pricing-bar"
import type { PricingState } from "./pricing-module"
import { VOICE_USER_TIER_PRICES } from "@/lib/pricing-config"
import { Switch } from "@/components/ui/switch"

interface VoiceBotPricingProps {
  businessType: "chat" | "voice";
  billingCycle: "monthly" | "yearly";
  activeUsers: number;
  currency: "INR" | "USD";
  setCurrency: (currency: "INR" | "USD") => void;
}
// Voice pricing tiers with updated pricing
const VOICE_PRICING_TIERS = [
  { name: "Basic", minMinutes: 1500, maxMinutes: 2500, basePrice: 14999 },
  { name: "Professional", minMinutes: 2501, maxMinutes: 7500, basePrice: 39999 },
  { name: "Enterprise", minMinutes: 7501, maxMinutes: Number.POSITIVE_INFINITY, basePrice: "Custom" },
]

// Voice provider add-on costs
const VOICE_PROVIDERS = [
  { id: "plivo", name: "Plivo", costPerMinute: 0.5 },
  { id: "twilio", name: "Twilio", costPerMinute: 1.0 },
  { id: "elevenlabs", name: "ElevenLabs", costPerMinute: 2.0 },
]

// Additional add-ons
const ADDITIONAL_ADDONS = [
  { id: "custom_voice", name: "Custom Voice", cost: 5000 },
  { id: "multi_language", name: "Multi-language Support", cost: 3000 },
  { id: "advanced_analytics", name: "Advanced Analytics", cost: 2000 },
]

export default function VoiceBotPricingTiers({
  businessType,
  billingCycle,
  activeUsers,
  currency,
  setCurrency,
}: VoiceBotPricingProps) {
  // Currency conversion rates
  const USD_TO_INR = 83;
  const INR_TO_USD = 1 / USD_TO_INR;

  const [state, setState] = useState<PricingState>({
    botType: "voice",
    billingCycle: billingCycle,
    chatSessions: 0,
    whatsappEnabled: false,
    voiceMinutes: activeUsers,
    voiceProvider: "plivo",
    totalPrice: 0,
    activeComponents: ["plivo"],
  });

  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const convertPrice = (price: number, toCurrency: "INR" | "USD") => {
    if (toCurrency === "USD") {
      return Math.round(price * INR_TO_USD);
    }
    return Math.round(price);
  };

  const formatPrice = (price: number, currency: "INR" | "USD") => {
    const convertedPrice = convertPrice(price, currency);
    return convertedPrice.toLocaleString();
  };

  const getCurrencySymbol = (currency: "INR" | "USD") => {
    return currency === "INR" ? "₹" : "$";
  };

  // Get current tier based on minutes
  const getCurrentTier = (minutes: number) => {
    return VOICE_PRICING_TIERS.find(
      (tier) => minutes >= tier.minMinutes && minutes <= tier.maxMinutes
    );
  };

  // Calculate price based on minutes, provider, and add-ons
  const calculatePrice = (minutes: number, provider: string, addons: string[]) => {
    const tier = getCurrentTier(minutes);
    if (!tier) return 0;
    if (tier.basePrice === "Custom") return -1; // Contact Sales

    const selectedProvider = VOICE_PROVIDERS.find(p => p.id === provider);
    const providerCost = selectedProvider ? selectedProvider.costPerMinute * minutes : 0;

    // Calculate base price
    let basePrice = typeof tier.basePrice === 'number' ? tier.basePrice : 0;
    if (minutes > tier.minMinutes) {
      const extraMinutes = minutes - tier.minMinutes;
      const pricePerExtraMinute = tier.name === "Basic" ? 150 : 80; // ₹150 for Basic, ₹80 for Professional
      basePrice += extraMinutes * pricePerExtraMinute;
    }

    // Calculate add-ons cost
    const addonsCost = addons.reduce((total, addonId) => {
      const addon = ADDITIONAL_ADDONS.find(a => a.id === addonId);
      return total + (addon ? addon.cost : 0);
    }, 0);

    // Apply yearly discount if applicable
    const yearlyMultiplier = billingCycle === "yearly" ? 0.8 : 1;

    return (basePrice + providerCost + addonsCost) * yearlyMultiplier;
  };

  useEffect(() => {
    const price = calculatePrice(state.voiceMinutes, state.voiceProvider, selectedAddons);
    setState(prev => ({ ...prev, totalPrice: price }));
  }, [state.voiceMinutes, state.voiceProvider, selectedAddons, billingCycle]);

  const handleMinutesChange = (value: number[]) => {
    setState(prev => ({ ...prev, voiceMinutes: value[0] }));
  };

  const handleProviderChange = (value: string) => {
    setState(prev => ({ ...prev, voiceProvider: value as "plivo" | "twilio" | "elevenlabs" }));
  };

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const currentTier = getCurrentTier(state.voiceMinutes);

  // Define minute markers for the slider
  const minuteMarkers = [1500, 2500, 3500, 4500, 5500, 6500, 7500, 8500];

  const CurrencyToggle = () => (
    <div className="flex items-center gap-4 p-6 dark:bg-gray-800 border-2 border-primary rounded-lg shadow-md mb-8">
      <div className="flex items-center space-x-3">
        <Switch
          id="currency-toggle"
          checked={currency === "USD"}
          onCheckedChange={(checked) => setCurrency(checked ? "USD" : "INR")}
        />
        <Label
          htmlFor="currency-toggle"
          className="flex flex-col cursor-pointer"
        >
          <span className="text-lg font-semibold text-primary">
            Currency Toggle
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Switch between INR (₹) and USD ($)
          </span>
        </Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Voice Bot Pricing</h2>
      <CurrencyToggle />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Voice Minutes per Month</h3>
          <span className="text-xl font-bold">{state.voiceMinutes.toLocaleString()}</span>
        </div>

        <Slider
          value={[state.voiceMinutes]}
          min={1500}
          max={85000}
          step={100}
          onValueChange={handleMinutesChange}
          className="mb-6"
        />

        <div className="flex justify-between text-sm text-gray-500">
          {minuteMarkers.map((minutes) => (
            <span key={minutes}>
              {minutes >= 1000 ? `${(minutes / 1000).toFixed(1)}k` : minutes}
            </span>
          ))}
        </div>
      </div>

      <DynamicPricingBar state={state} updateState={setState} />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select Voice Provider</h3>

        <RadioGroup
          value={state.voiceProvider}
          onValueChange={handleProviderChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {VOICE_PROVIDERS.map((provider) => (
            <div key={provider.id} className="flex items-start space-x-3">
              <RadioGroupItem value={provider.id} id={provider.id} className="mt-1" />
              <Label htmlFor={provider.id} className="flex flex-col cursor-pointer">
                <span className="font-medium">{provider.name}</span>
                <span className="text-sm text-gray-500">
                  +{getCurrencySymbol(currency)}{convertPrice(provider.costPerMinute, currency).toFixed(2)}/minute
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Add-ons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ADDITIONAL_ADDONS.map((addon) => (
            <div key={addon.id} className="flex items-start space-x-3">
              <Switch
                id={addon.id}
                checked={selectedAddons.includes(addon.id)}
                onCheckedChange={() => handleAddonToggle(addon.id)}
              />
              <Label htmlFor={addon.id} className="flex flex-col cursor-pointer">
                <span className="font-medium">{addon.name}</span>
                <span className="text-sm text-gray-500">
                  +{getCurrencySymbol(currency)}{formatPrice(addon.cost, currency)}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Price Breakdown</h3>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span>Base Rate ({currentTier?.name} Tier)</span>
              <span>
                {currentTier?.basePrice === "Custom"
                  ? "Contact Sales"
                  : `${getCurrencySymbol(currency)}${formatPrice(currentTier?.basePrice as number, currency)}`}
              </span>
            </div>
            {state.voiceProvider && (
              <div className="flex justify-between">
                <span>{VOICE_PROVIDERS.find(p => p.id === state.voiceProvider)?.name} Add-on</span>
                <span>
                  +{getCurrencySymbol(currency)}{formatPrice(
                    state.voiceMinutes *
                    (VOICE_PROVIDERS.find(p => p.id === state.voiceProvider)?.costPerMinute || 0),
                    currency
                  )}
                </span>
              </div>
            )}
            {selectedAddons.length > 0 && (
              <div className="flex justify-between">
                <span>Additional Add-ons</span>
                <span>
                  +{getCurrencySymbol(currency)}{formatPrice(
                    selectedAddons.reduce((total, addonId) => {
                      const addon = ADDITIONAL_ADDONS.find(a => a.id === addonId);
                      return total + (addon ? addon.cost : 0);
                    }, 0),
                    currency
                  )}
                </span>
              </div>
            )}
            {billingCycle === "yearly" && (
              <div className="flex justify-between text-green-500">
                <span>Yearly Discount (20%)</span>
                <span>-20%</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>
                {state.totalPrice === -1
                  ? "Contact Sales"
                  : `${getCurrencySymbol(currency)}${formatPrice(state.totalPrice, currency)}`}
              </span>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>Current tier: {currentTier?.name}</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Basic (1.5k-2.5k mins): {getCurrencySymbol(currency)}14,999 base + {getCurrencySymbol(currency)}150/extra minute</li>
              <li>Professional (2.5k-7.5k mins): {getCurrencySymbol(currency)}39,999 base + {getCurrencySymbol(currency)}80/extra minute</li>
              <li>Enterprise (7.5k+ mins): Custom pricing</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

