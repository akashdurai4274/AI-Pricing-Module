"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BASE_PRICING_TIERS,
  calculateDynamicPrice,
  getPriceDisplay,
} from "@/lib/pricing-config";
import type { PricingState } from "./pricing-module";
import { Check } from "lucide-react";

interface ChatBotPricingProps {
  state: PricingState;
  updateState: (newState: Partial<PricingState>) => void;
}

export default function ChatBotPricing({
  state,
  updateState,
}: ChatBotPricingProps) {
  const [highlightedTier, setHighlightedTier] = useState<number | null>(0);

  const calculatePrice = (sessions: number, whatsappEnabled: boolean) => {
    const basePrice = calculateDynamicPrice(sessions);

    if (basePrice === -1) return basePrice; // "Contact Sales" case

    // Add WhatsApp cost if enabled (₹500 extra)
    return whatsappEnabled ? basePrice + 500 : basePrice;
  };

  useEffect(() => {
    const price = calculatePrice(state.chatSessions, state.whatsappEnabled);
    updateState({ totalPrice: price });

    const tierIndex = BASE_PRICING_TIERS.findIndex(
      (tier) => tier.baseSessions === state.chatSessions
    );
    setHighlightedTier(tierIndex !== -1 ? tierIndex : null);
  }, [state.chatSessions, state.whatsappEnabled]);

  const formatPrice = (price: number) => {
    return Math.round(price).toLocaleString(); // Remove decimals and add thousand separators
  };

  // WhatsApp toggle component
  const WhatsAppToggle = () => (
    <div className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 border-2 border-primary rounded-lg shadow-md mb-8">
      <div className="flex items-center space-x-3">
        <Switch
          id="whatsapp-toggle"
          checked={state.whatsappEnabled}
          onCheckedChange={(checked) =>
            updateState({ whatsappEnabled: checked })
          }
        />
        <Label
          htmlFor="whatsapp-toggle"
          className="flex flex-col cursor-pointer"
        >
          <span className="text-lg font-semibold text-primary">
            WhatsApp Integration
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Enable WhatsApp channel (+₹500/month)
          </span>
        </Label>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Chat Bot Pricing</h2>

      {/* WhatsApp toggle with improved visibility */}
      <WhatsAppToggle />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Chat Sessions per Month</h3>
          <span className="text-xl font-bold">{state.chatSessions}</span>
        </div>

        <Slider
          value={[state.chatSessions]}
          min={50}
          max={1000}
          step={10}
          onValueChange={(value) => updateState({ chatSessions: value[0] })}
          className="mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {BASE_PRICING_TIERS.map((tier, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all ${
                highlightedTier === index
                  ? "border-primary ring-2 ring-primary ring-opacity-50"
                  : "hover:border-gray-300"
              }`}
              onClick={() => {
                updateState({ chatSessions: tier.baseSessions });
                setHighlightedTier(index);
              }}
            >
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{tier.name}</h3>
                <div className="text-2xl font-bold mb-1">
                  {tier.basePrice === "Custom" ? (
                    "Contact Sales"
                  ) : (
                    <>₹{tier.basePrice.toLocaleString()}</>
                  )}
                </div>
                <div className="text-sm text-gray-500 mb-4">per month</div>

                <ul className="space-y-2 text-sm">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full mt-4">Choose Plan</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
