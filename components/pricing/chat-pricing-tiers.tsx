"use client";

import { useState, useEffect } from "react";
import { Check, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BASE_PRICING_TIERS,
  calculateDynamicPrice,
  CHAT_USER_TIER_PRICES,
  CHAT_BOT_FEATURES,
} from "@/lib/pricing-config";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { PricingState } from "./pricing-module";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PricingTiersProps {
  businessType: "chat" | "voice";
  billingCycle: "monthly" | "yearly";
  activeUsers: number;
  currency: "INR" | "USD";
  setCurrency: (currency: "INR" | "USD") => void;
}

interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number | null;
  features: string[];
  maxUsers: number | null;
  buttonText: string;
  buttonAction: string;
}

export default function ChatBotPricingTiers({
  businessType,
  billingCycle,
  activeUsers,
  currency,
  setCurrency,
}: PricingTiersProps) {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  // Currency conversion rates (you can update these as needed)
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

  useEffect(() => {
    // Find the appropriate pricing tier based on active users
    const chat_currentTier = CHAT_USER_TIER_PRICES.find(
      (tier, index) =>
        activeUsers <= tier.users || index === CHAT_USER_TIER_PRICES.length - 1
    );

    // Apply yearly discount (20%)
    const yearlyMultiplier = billingCycle === "yearly" ? 0.8 : 1;

    // WhatsApp cost (₹500 or ~$6 USD)
    const whatsappCost = whatsappEnabled ? 500 : 0;

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
        name: "Free",
        description: "No credit card needed to sign up.",
        monthlyPrice: whatsappEnabled ? whatsappCost : 0,
        features: [
          "Any type of application",
          "Password Authentication with Email, Username or Phone Number",
          "Passkey Authentication",
          "Social Authentication (Google, Facebook, etc.)",
          "5 organizations",
          ...(whatsappEnabled ? ["WhatsApp Integration"] : []),
        ],
        maxUsers: 25000,
        buttonText: "Start building for free",
        buttonAction: "start",
      },
      {
        name: "Intelligence",
        description: "For projects with higher production demands.",
        monthlyPrice: chat_currentTier?.essentialsPrice
          ? (chat_currentTier.essentialsPrice + whatsappCost) * yearlyMultiplier
          : null,
        features: [
          "Everything in Free, plus...",
          "Higher End-User Authentication & API Limits",
          "Magic Link & SMS Authentication",
          "Role-based Access Control",
          "10 organizations",
          ...(whatsappEnabled ? ["WhatsApp Integration"] : []),
        ],
        maxUsers: essentialsMaxUsers,
        buttonText: chat_currentTier?.essentialsPrice
          ? "Choose Plan"
          : "Contact us",
        buttonAction: chat_currentTier?.essentialsPrice ? "signup" : "contact",
      },
      {
        name: "Super Intelligence",
        description: "Best for teams and projects that need added security.",
        monthlyPrice: chat_currentTier?.professionalPrice
          ? (chat_currentTier.professionalPrice + whatsappCost) *
            yearlyMultiplier
          : null,
        features: [
          "Everything in Essentials, plus...",
          "Use your existing User Database for Logins",
          "Multi-Factor Authentication (with OTP)",
          "10 organizations",
          "Enhanced Attack Protection",
          ...(whatsappEnabled ? ["WhatsApp Integration"] : []),
        ],
        maxUsers: professionalMaxUsers,
        buttonText: chat_currentTier?.professionalPrice
          ? "Sign up"
          : "Contact us",
        buttonAction: chat_currentTier?.professionalPrice
          ? "signup"
          : "contact",
      },
      {
        name: "Enterprise",
        description:
          "For enterprises that need to scale. Top-tier SLAs, advanced security, white-glove support and more.",
        monthlyPrice: null,
        features: [
          "Everything in Professional plus...",
          "Custom User & SSO Tiers",
          "99.99% SLA",
          "Enterprise Rate Limits",
          "Enterprise Administration & Support",
          ...(whatsappEnabled ? ["WhatsApp Integration"] : []),
        ],
        maxUsers: null,
        buttonText: "Contact us",
        buttonAction: "contact",
      },
    ];

    setPricingTiers(tiers);
  }, [activeUsers, billingCycle, businessType, whatsappEnabled]);

  const [highlightedTier, setHighlightedTier] = useState<number | null>(0);
  interface ChatBotPricingProps {
    state: PricingState;
    updateState: (newState: Partial<PricingState>) => void;
  }

  const calculatePrice = (sessions: number, whatsappEnabled: boolean) => {
    const basePrice = calculateDynamicPrice(sessions);

    if (basePrice === -1) return basePrice; // "Contact Sales" case

    // Add WhatsApp cost if enabled (₹500 extra)
    return whatsappEnabled ? basePrice + 500 : basePrice;
  };

  const [state, setState] = useState<PricingState>({
    botType: "chat",
    billingCycle: "monthly",
    chatSessions: 60, // Start with Basic tier
    whatsappEnabled: false,
    voiceMinutes: 100,
    voiceProvider: "plivo",
    totalPrice: 1999, // Default starting price (Basic tier)
    activeComponents: ["tringai", "plivo", "custom", "elevenlabs", "vapi"],
  });

  const updateState = (newState: Partial<PricingState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  useEffect(() => {
    const price = calculatePrice(state.chatSessions, state.whatsappEnabled);
    updateState({ totalPrice: price });

    const tierIndex = BASE_PRICING_TIERS.findIndex(
      (tier) => tier.baseSessions === state.chatSessions
    );
    setHighlightedTier(tierIndex !== -1 ? tierIndex : null);
  }, [state.chatSessions, state.whatsappEnabled]);

  const WhatsAppToggle = () => (
    <div className="flex items-center justify-end gap-4  mb-8">
      <div className="flex items-center space-x-3 p-6 border-2 border-yellow-200 rounded-lg shadow-md">
        <Switch
          id="whatsapp-toggle"
          checked={whatsappEnabled}
          onCheckedChange={setWhatsappEnabled}
        />
        <Label
          htmlFor="whatsapp-toggle"
          className="flex flex-col cursor-pointer"
        >
          <span className="text-lg font-semibold text-yellow-400">
            WhatsApp Integration
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Enable WhatsApp channel (+{getCurrencySymbol(currency)}500/month)
          </span>
        </Label>
      </div>
    </div>
  );

  const CurrencyToggle = () => (
    <div className="flex items-center gap-4 p-6 bg-white border-2 border-primary rounded-lg shadow-md mb-8">
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
    <>
      <div className="text-2xl text-center font-bold mb-4">
        Chat Bot Pricing
      </div>

      <WhatsAppToggle />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-lg overflow-hidden hover:scale-105 border-2   transition-all duration-200 `}
          >
            <div
              className={`p-6 h-full flex flex-col bg-white shadow-lg ${
                tier.name === "Enterprise"
                  ? "bg-blue-800 text-white shadow-lg hover:border-slate-400"
                  : "bg-white hover:border-yellow-400"
              }
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>

              {tier.monthlyPrice !== null ? (
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-sm">
                      {getCurrencySymbol(currency)}
                    </span>
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

              <p className="text-gray-400 mb-6 h-24 p-3">{tier.description}</p>

              <div className="mt-5">
                <Button
                  onClick={() =>
                    console.log(`${tier.buttonAction} for ${tier.name}`)
                  }
                  variant={tier.name === "Free" ? "secondary" : "outline"}
                  className={`mb-6 w-full bg-white text-yellow-400 border-2 border-yellow-200 hover:bg-yellow-400 hover:text-white shadow-lg ${
                    tier.name === "Enterprise"
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
                    {/* Tring AI with Dynamic Sessions */}
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>
                        Tring AI
                        <br />
                        {tier.name === "Free"
                          ? "50"
                          : tier.name === "Intelligence"
                          ? activeUsers < 60
                            ? activeUsers
                            : 60
                          : tier.name === "Super Intelligence"
                          ? activeUsers <= 250
                            ? 250
                            : activeUsers
                          : "1000+"}{" "}
                        Free Chat Sessions
                      </span>
                    </li>

                    {/* No of Chatbots */}
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>
                        {tier.name === "Free"
                          ? "1"
                          : tier.name === "Intelligence"
                          ? "2"
                          : tier.name === "Super Intelligence"
                          ? "10"
                          : "Unlimited"}{" "}
                        Chatbot
                        {tier.name === "Free" || tier.name === "Intelligence"
                          ? ""
                          : "s"}
                      </span>
                    </li>

                    {/* Widget Customization */}
                    <li className="flex items-start">
                      {tier.name === "Free" ? (
                        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      )}
                      <span>Widget Customization</span>
                    </li>

                    {/* Lead Gen */}
                    <li className="flex items-start">
                      {tier.name === "Free" || tier.name === "Intelligence" ? (
                        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      )}
                      <span>Lead Gen</span>
                    </li>

                    {/* CRM Integration */}
                    <li className="flex items-start">
                      {tier.name === "Free" || tier.name === "Intelligence" ? (
                        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      )}
                      <span>CRM Integration</span>
                    </li>

                    {/* Extra Chat Session */}
                    <li className="flex items-start">
                      {tier.name === "Free" ? (
                        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      )}
                      <span>
                        {tier.name === "Free"
                          ? "Extra Chat Session"
                          : tier.name === "Intelligence"
                          ? "₹10 per Chat Session"
                          : tier.name === "Super Intelligence"
                          ? "₹8 per Chat Session"
                          : "Talk to sales for Extra Chat Session"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
    </>
  );
}
