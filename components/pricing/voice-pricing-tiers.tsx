"use client";

import { useState, useEffect } from "react";
import { Check, ArrowRight, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VOICE_USER_TIER_PRICES, type PricingTier } from "@/lib/pricing-config";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import PricingChart from "./pricing-chart";
import { PricingState } from "./pricing-module";

interface PricingTiersProps {
  businessType: "chat" | "voice";
  billingCycle: "monthly" | "yearly";
  activeUsers: number;
  currency: "INR" | "USD";
  setCurrency: (currency: "INR" | "USD") => void;
}

interface VoiceProvider {
  id: string;
  name: string;
  description: string;
  pricing: {
    monthly: number;
    outgoing: number;
    incoming: number;
    region: "US" | "IN";
    tiers?: {
      name: string;
      minutes: number;
      price: number;
    }[];
  };
}

const VOICE_PROVIDERS: VoiceProvider[] = [
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description:
      "Premium voice synthesis with natural-sounding voices and emotions.",
    pricing: {
      monthly: 0,
      outgoing: 0,
      incoming: 0,
      region: "US",
      tiers: [
        { name: "Creator", minutes: 100, price: 22 },
        { name: "Pro", minutes: 500, price: 99 },
        { name: "Scale", minutes: 2000, price: 330 },
        { name: "Business", minutes: 11000, price: 0 }, // Custom pricing
      ],
    },
  },
  {
    id: "twilio",
    name: "Twilio",
    description:
      "Enhanced voice quality with global coverage and advanced features.",
    pricing: {
      monthly: 0,
      outgoing: 0.014,
      incoming: 0.0085,
      region: "US",
    },
  },
  {
    id: "plivo",
    name: "Plivo",
    description:
      "Standard voice integration with good quality and reliability.",
    pricing: {
      monthly: 0.5,
      outgoing: 0.01,
      incoming: 0.0055,
      region: "US",
    },
  },
  {
    id: "telnyx",
    name: "Telnyx",
    description: "Cost-effective voice provider with competitive rates.",
    pricing: {
      monthly: 1.0,
      outgoing: 0.0035,
      incoming: 0.0035,
      region: "US",
    },
  },
  {
    id: "exotel",
    name: "Exotel",
    description: "Indian voice provider with local number support.",
    pricing: {
      monthly: 10000,
      outgoing: 0.6,
      incoming: 0,
      region: "IN",
    },
  },
];

// Add pricing bar interface
interface PricingBarItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  description: string;
  isActive: boolean;
  isDefault?: boolean;
  subtitle?: string;
}

// Update the PRICING_BAR_ITEMS with more accurate pricing and descriptions
const PRICING_BAR_ITEMS: PricingBarItem[] = [
  {
    id: "twilio",
    name: "Twilio",
    icon: "T",
    price: 2,
    description: "Enhanced voice quality with global coverage",
    isActive: false,
  },
  {
    id: "plivo",
    name: "Plivo",
    icon: "P",
    price: 4,
    description: "Standard voice integration with reliability",
    isActive: true,
    isDefault: true,
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    icon: "E",
    price: 7,
    description: "Premium voice synthesis with emotions",
    isActive: false,
  },
  {
    id: "telnyx",
    name: "Telnyx",
    icon: "T",
    price: 3,
    description: "Cost-effective voice provider",
    isActive: false,
  },
  {
    id: "exotel",
    name: "Exotel",
    icon: "E",
    price: 5,
    description: "Indian voice provider with local support",
    isActive: false,
  },
  {
    id: "tringai",
    name: "Tring AI",
    icon: "/tring.png",
    price: 6,
    description: "Core Voice Platform",
    isActive: true,
    isDefault: true,
    subtitle: "Core Platform",
  },
];

export default function VoiceBotPricingTiers({
  businessType,
  billingCycle,
  activeUsers,
  currency,
  setCurrency,
}: PricingTiersProps) {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("plivo");
  const [voiceMinutes, setVoiceMinutes] = useState<number>(1500);
  const [pricingBarItems, setPricingBarItems] =
    useState<PricingBarItem[]>(PRICING_BAR_ITEMS);

  // Currency conversion rates
  const USD_TO_INR = 83;
  const INR_TO_USD = 1 / USD_TO_INR;

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

  const calculateProviderCost = (minutes: number, providerId: string) => {
    const provider = VOICE_PROVIDERS.find((p) => p.id === providerId);
    if (!provider) return 0;

    // For ElevenLabs, use tier-based pricing
    if (provider.id === "elevenlabs" && provider.pricing.tiers) {
      const tier = provider.pricing.tiers.find((t) => minutes <= t.minutes);
      if (tier) {
        return tier.price;
      }
      // If minutes exceed all tiers, use custom pricing
      return -1; // Indicates "Contact Sales"
    }

    // For other providers, calculate based on per-minute rates
    const baseCost = provider.pricing.monthly;
    const outgoingCost = provider.pricing.outgoing * minutes;
    const incomingCost = provider.pricing.incoming * minutes;

    return baseCost + outgoingCost + incomingCost;
  };

  useEffect(() => {
    // Find the appropriate pricing tier based on active users
    const voice_currentTier = VOICE_USER_TIER_PRICES.find(
      (tier, index) =>
        activeUsers <= tier.users || index === VOICE_USER_TIER_PRICES.length - 1
    );

    // Apply yearly discount (20%)
    const yearlyMultiplier = billingCycle === "yearly" ? 0.8 : 1;

    // Calculate provider cost
    const providerCost = calculateProviderCost(voiceMinutes, selectedProvider);

    // Determine max users for each tier based on current selection
    let essentialsMaxUsers = 1000;
    let professionalMaxUsers = 1000;

    if (activeUsers <= 7500) {
      essentialsMaxUsers = activeUsers;
      professionalMaxUsers = activeUsers;
    } else if (activeUsers <= 20000) {
      essentialsMaxUsers = activeUsers;
      professionalMaxUsers = activeUsers;
    } else {
      essentialsMaxUsers = 30000;
      professionalMaxUsers = 30000;
    }

    const tiers: PricingTier[] = [
      {
        name: "Fluent",
        description: "For projects with higher production demands.",
        monthlyPrice: voice_currentTier?.essentialsPrice
          ? (voice_currentTier.essentialsPrice + providerCost) *
            yearlyMultiplier
          : null,
        features: [
          "Everything in Free, plus...",
          "Higher End-User Authentication & API Limits",
          "Magic Link & SMS Authentication",
          "Role-based Access Control",
          "10 organizations",
          `${
            VOICE_PROVIDERS.find((p) => p.id === selectedProvider)?.name
          } Voice Integration`,
        ],
        maxUsers: essentialsMaxUsers,
        buttonText: voice_currentTier?.essentialsPrice
          ? "Sign up"
          : "Contact us",
        buttonAction: voice_currentTier?.essentialsPrice ? "signup" : "contact",
      },
      {
        name: "Lucid",
        description: "Best for teams and projects that need added security.",
        monthlyPrice: voice_currentTier?.professionalPrice
          ? (voice_currentTier.professionalPrice + providerCost) *
            yearlyMultiplier
          : null,
        features: [
          "Everything in Essentials, plus...",
          "Use your existing User Database for Logins",
          "Multi-Factor Authentication (with OTP)",
          "10 organizations",
          "Enhanced Attack Protection",
          `${
            VOICE_PROVIDERS.find((p) => p.id === selectedProvider)?.name
          } Voice Integration`,
        ],
        maxUsers: professionalMaxUsers,
        buttonText: voice_currentTier?.professionalPrice
          ? "Sign up"
          : "Contact us",
        buttonAction: voice_currentTier?.professionalPrice
          ? "signup"
          : "contact",
      },
      {
        name: "Eloquent (Enterprise)",
        description:
          "For enterprises that need to scale. Top-tier SLAs, advanced security, white-glove support and more.",
        monthlyPrice: null,
        features: [
          "Everything in Professional plus...",
          "Custom User & SSO Tiers",
          "99.99% SLA",
          "Enterprise Rate Limits",
          "Enterprise Administration & Support",
          `${
            VOICE_PROVIDERS.find((p) => p.id === selectedProvider)?.name
          } Voice Integration`,
        ],
        maxUsers: null,
        buttonText: "Contact us",
        buttonAction: "contact",
      },
    ];

    setPricingTiers(tiers);
  }, [activeUsers, billingCycle, businessType, selectedProvider, voiceMinutes]);

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

  // Add this function to handle pricing bar item toggle
  const togglePricingBarItem = (itemId: string) => {
    setPricingBarItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId && !item.isDefault) {
          return { ...item, isActive: !item.isActive };
        }
        return item;
      })
    );
  };

  // Update the DynamicPricingBar component
  const DynamicPricingBar = () => {
    const activeItems = pricingBarItems.filter((item) => item.isActive);
    const totalPrice = activeItems.reduce((sum, item) => sum + item.price, 0);

    return (
      <div className="p-6 rounded-lg my-[100px]">
        <div className="relative flex flex-col items-center w-full">
          {/* Tring AI Logo and Title */}
          {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 flex flex-col items-center">
            <img src="/tring.png" alt="Tring AI" className="w-12 h-12 mb-2" />
            <span className="text-white font-medium">Core Platform</span>
            <div className="h-16 w-0.5 bg-gradient-to-b from-[#4F46E5] to-transparent mt-2" />
          </div>
 */}
          {/* Main container with fixed height */}
          <div className="relative w-full max-w-4xl h-[400px]">
            {/* Price Bar */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700">
                <div className="flex">
                  {pricingBarItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex-1 py-6 px-2 text-center transition-all duration-300 relative
                        ${item.isActive ? "bg-opacity-100" : "bg-opacity-30"}`}
                      style={{
                        backgroundColor: getItemColor(item.id),
                        opacity: item.isActive ? 1 : 0.5,
                      }}
                    >
                      {item.isActive && (
                        <div
                          className="absolute inset-0 animate-pulse"
                          style={{
                            backgroundColor: getItemColor(item.id),
                            filter: "blur(20px)",
                            opacity: 0.3,
                            zIndex: -1,
                          }}
                        />
                      )}
                      <div className="relative z-10">
                        <span
                          className={`text-3xl font-bold text-white transition-all duration-300
                          ${
                            item.isActive
                              ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                              : ""
                          }`}
                        >
                          {item.price}
                        </span>
                        <span className="text-sm text-white ml-1">¢/min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Icons and Labels */}
            {pricingBarItems.map((item, index) => {
              const isTop = index % 2 === 0;
              const position = (index / (pricingBarItems.length - 1)) * 95;

              return (
                <div
                  key={item.id}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${position}%`,
                    top: isTop ? "-20px" : "auto",
                    bottom: isTop ? "auto" : "-20px",
                    transform: "translateX(-50%)",
                  }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                            ${
                              item.isActive
                                ? " border-2  border-yellow-400  shadow-[0_0_15px_rgba(var(--primary),0.5)] scale-110"
                                : "bg-gray-300"
                            }`}
                        >
                          {item.id === "tringai" ? (
                            <img
                              src={item.icon}
                              alt="Tring AI"
                              className="w-8 h-8  rounded-full"
                            />
                          ) : (
                            <span
                              className={`text-lg font-bold  transition-all duration-300
                              ${
                                item.isActive
                                  ? " text-yellow-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                  : "text-black"
                              }`}
                            >
                              {item.icon}
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <span className="text-white font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                  {/* {item.subtitle && (
                    <span className="text-gray-400 text-sm">{item.subtitle}</span>
                  )} */}

                  {/* Connecting Line */}
                  <div
                    className="absolute w-0.5 transition-all duration-300"
                    style={{
                      height: "90px",
                      top: isTop ? "100%" : "auto",
                      bottom: isTop ? "auto" : "100%",
                      marginTop: isTop ? "10px" : "0",
                      marginBottom: isTop ? "0" : "10px",
                      background: item.isActive
                        ? `linear-gradient(to ${
                            isTop ? "bottom" : "top"
                          }, ${getItemColor(item.id)}, transparent)`
                        : `linear-gradient(to ${
                            isTop ? "bottom" : "top"
                          }, ${getItemColor(item.id)}, transparent)`,
                      boxShadow: item.isActive
                        ? `0 0 10px ${getItemColor(item.id)}`
                        : "",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Total Price Display */}
          <div className="mt-8 text-center border-2 border-yellow-400 rounded-lg p-2">
            <span className="text-gray-800 ">Total Cost: </span>
            <span className="text-2xl font-bold ">{totalPrice}¢/min</span>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to get color for each section
  const getItemColor = (id: string) => {
    const colors: Record<string, string> = {
      twilio: "#2D1B69",
      plivo: "#1B3569",
      elevenlabs: "#1B6945",
      telnyx: "#691B1B",
      exotel: "#1B6969",
      tringai: "#4F46E5",
    };
    return colors[id] || "#1B1B1B";
  };

  // Update the radio group section
  <RadioGroup
    value={selectedProvider}
    onValueChange={(value) => {
      setSelectedProvider(value);
      // Update pricing bar items based on selected provider
      setPricingBarItems((prev) =>
        prev.map((item) => ({
          ...item,
          isActive: getActiveStateForProvider(value, item.id),
          price: getUpdatedPrice(value, item.id),
        }))
      );
    }}
    className="grid grid-cols-1 md:grid-cols-3 gap-4"
  >
    {VOICE_PROVIDERS.map((provider) => (
      <div
        key={provider.id}
        className="flex items-start space-x-2 bg-white p-4 rounded-lg"
      >
        <RadioGroupItem value={provider.id} id={provider.id} className="mt-1" />
        <Label htmlFor={provider.id} className="flex flex-col cursor-pointer">
          <span className="font-medium text-black">{provider.name}</span>
          {provider.pricing.tiers ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {provider.pricing.tiers.map((tier, index) => (
                <div key={index}>
                  {tier.name}: {getCurrencySymbol(currency)}
                  {convertPrice(tier.price, currency)}/{tier.minutes} mins
                </div>
              ))}
            </div>
          ) : (
            <>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {getCurrencySymbol(currency)}
                {convertPrice(provider.pricing.monthly, currency)}/month
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Outgoing: {getCurrencySymbol(currency)}
                {convertPrice(provider.pricing.outgoing, currency)}/min
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Incoming: {getCurrencySymbol(currency)}
                {convertPrice(provider.pricing.incoming, currency)}/min
              </span>
            </>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {provider.description}
          </span>
        </Label>
      </div>
    ))}
  </RadioGroup>;

  // Add this helper function before the return statement
  const getUpdatedPrice = (providerId: string, itemId: string) => {
    // Base prices for each component
    const basePrices: Record<string, number> = {
      twilio: 2,
      plivo: 4,
      elevenlabs: 7,
      telnyx: 3,
      exotel: 5,
      tringai: 6,
    };

    // Price modifiers based on provider
    const priceModifiers: Record<string, Record<string, number>> = {
      elevenlabs: {
        voice: 9, // Higher price for premium voice
        model: 5, // Better AI model
        transcriber: 3,
      },
      twilio: {
        telephony: 4, // Higher price for global coverage
        vapi: 6,
      },
      plivo: {
        telephony: 3,
        model: 4,
      },
      telnyx: {
        telephony: 2, // More cost-effective
        vapi: 4,
      },
      exotel: {
        telephony: 3,
        vapi: 5,
      },
    };

    // If it's Tring AI, always return base price
    if (itemId === "tringai") return basePrices[itemId];

    // Return modified price if available, otherwise return base price
    return priceModifiers[providerId]?.[itemId] || basePrices[itemId];
  };

  // Update the getActiveStateForProvider function
  const getActiveStateForProvider = (providerId: string, itemId: string) => {
    // Tring AI and Plivo are always active
    if (itemId === "tringai" || itemId === "plivo") return true;

    // If the selected provider matches the item ID, activate it
    return providerId === itemId;
  };

  // Add useEffect to initialize pricing bar items with correct active states
  useEffect(() => {
    setPricingBarItems((prev) =>
      prev.map((item) => ({
        ...item,
        isActive: getActiveStateForProvider(selectedProvider, item.id),
        price: getUpdatedPrice(selectedProvider, item.id),
      }))
    );
  }, [selectedProvider]);

  return (
    <>
      <div className="text-2xl text-center font-bold mb-4">
        Voice Bot Pricing
      </div>
      {/*       <CurrencyToggle />
       */}
      <DynamicPricingBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
        {pricingTiers.map((tier) => (
          /*           <div key={tier.name} className="rounded-lg overflow-hidden">
           */
          <div
            key={tier.name}
            className={`p-6 h-full flex flex-col rounded-lg border-2 hover:scale-105 transition-all duration-200 ${
              tier.name === "Eloquent (Enterprise)"
                ? "bg-blue-500 text-white shadow-lg hover:border-slate-400"
                : "bg-white hover:border-yellow-400"
            }`}
          >
            <h3 className="text-xl font-bold mb-2">{tier.name}</h3>

            {tier.monthlyPrice !== null ? (
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-sm">{getCurrencySymbol(currency)}</span>
                  <span className="text-3xl font-bold">
                    {formatPrice(tier.monthlyPrice, currency)}
                  </span>
                  <span className="text-gray-400 ml-1">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
              </div>
            ) : (
              tier.name !== "Free" && (
                <div className="mb-4">
                  <span className="text-xl">Get in touch</span>
                </div>
              )
            )}

            <p
              className={`text-gray-400 mb-6 ${
                tier.name === "Eloquent (Enterprise)"
                  ? "text-white"
                  : "text-gray-400"
              }`}
            >
              {tier.description}
            </p>

            <div className="mt-auto">
              <Button
                onClick={() =>
                  console.log(`${tier.buttonAction} for ${tier.name}`)
                }
                variant={tier.name === "Free" ? "secondary" : "outline"}
                className={`mb-6 w-full bg-white text-yellow-400 border-2 border-yellow-200 hover:bg-yellow-400 hover:text-white shadow-lg ${
                  tier.name === "Eloquent (Enterprise)"
                    ? "bg-yellow-400 text-white hover:bg-white hover:text-yellow-400"
                    : "shadow-yellow-100 "
                }`}
              >
                {tier.buttonText}
                {tier.buttonAction === "start" && (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>

              <div className="text-sm">
                <ul className="space-y-4">
                  {/* Lead Gen */}
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Lead Gen</span>
                  </li>

                  {/* CRM Integration */}
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>CRM Integration</span>
                  </li>

                  {/* Real Time Booking */}
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Real Time Booking</span>
                  </li>

                  {/* Minutes with Dynamic Value */}
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>
                      {tier.name === "Fluent"
                        ? activeUsers <= 1500
                          ? activeUsers
                          : 1500
                        : tier.name === "Lucid"
                        ? activeUsers <= 5000
                          ? 5000
                          : activeUsers
                        : "10,000+"}{" "}
                      Mins
                    </span>
                  </li>

                  {/* Extra Minutes Cost */}
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>
                      {tier.name === "Fluent"
                        ? "₹6 per Extra Minute"
                        : tier.name === "Lucid"
                        ? "₹5 per Extra Minute"
                        : "Talk to Sales for Extra Mins Cost"}
                    </span>
                  </li>

                  {/* Voice Customization */}
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>
                      {tier.name === "Fluent"
                        ? "Voice Customization"
                        : "Advanced Voice Customization"}
                    </span>
                  </li>

                  {/* Multi-lingual */}
                  <li className="flex items-start">
                    {tier.name === "Fluent" ? (
                      <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    ) : (
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    )}
                    <span>Multi-lingual</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className=" dark:bg-slate-800 p-6 mt-20 rounded-xl  border border-yellow-200 ">
        <div className="text-2xl font-bold mb-4 text-center">
          Voice Add On's
        </div>
        <div className="space-y-4">
          <div className="flex items-center">
            <h4 className="text-sm font-medium">Voice Provider</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    Select a voice provider for your bot. Each provider offers
                    different quality and features at different rates.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <RadioGroup
            value={selectedProvider}
            onValueChange={(value) => {
              setSelectedProvider(value);
              // Update pricing bar items based on selected provider
              setPricingBarItems((prev) =>
                prev.map((item) => ({
                  ...item,
                  isActive: getActiveStateForProvider(value, item.id),
                  price: getUpdatedPrice(value, item.id),
                }))
              );
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {VOICE_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                className="flex items-start space-x-2 bg-white p-4 rounded-lg"
              >
                <RadioGroupItem
                  value={provider.id}
                  id={provider.id}
                  className="mt-1"
                />
                <Label
                  htmlFor={provider.id}
                  className="flex flex-col cursor-pointer"
                >
                  <span className="font-medium text-black">
                    {provider.name}
                  </span>
                  {provider.pricing.tiers ? (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {provider.pricing.tiers.map((tier, index) => (
                        <div key={index}>
                          {tier.name}: {getCurrencySymbol(currency)}
                          {convertPrice(tier.price, currency)}/{tier.minutes}{" "}
                          mins
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {getCurrencySymbol(currency)}
                        {convertPrice(provider.pricing.monthly, currency)}/month
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Outgoing: {getCurrencySymbol(currency)}
                        {convertPrice(provider.pricing.outgoing, currency)}/min
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Incoming: {getCurrencySymbol(currency)}
                        {convertPrice(provider.pricing.incoming, currency)}/min
                      </span>
                    </>
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {provider.description}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </>
  );
}
