"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ChatBotPricing from "./chat-bot-pricing";
import VoiceBotPricing from "./voice-bot-pricing";
import FeatureComparisonTable from "./feature-comparison-table";
import PriceSummaryCard from "./price-summary-card";

// Update the PricingState interface to include activeComponents
export interface PricingState {
  botType: BotType;
  billingCycle: BillingCycle;
  chatSessions: number;
  whatsappEnabled: boolean;
  voiceMinutes: number;
  voiceProvider: "plivo" | "twilio" | "elevenlabs";
  totalPrice: number;
  activeComponents: string[];
}

export type BillingCycle = "monthly" | "yearly";
export type BotType = "chat" | "voice";

export default function PricingModule() {
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

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("pricingState");
    if (savedState) {
      setState(JSON.parse(savedState));
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pricingState", JSON.stringify(state));
  }, [state]);

  const updateState = (newState: Partial<PricingState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const toggleBillingCycle = () => {
    updateState({
      billingCycle: state.billingCycle === "monthly" ? "yearly" : "monthly",
    });
  };

  // Apply yearly discount (20%)
  const yearlyDiscount = state.billingCycle === "yearly" ? 0.8 : 1;
  const displayPrice = (state.totalPrice * yearlyDiscount).toFixed(2);

  // Update the tab change handler
  /* const handleBotTypeChange = (value: string) => {
    updateState({
      botType: value as BotType,
      // Reset relevant state based on bot type
      totalPrice: value === "chat" ? 10 : 0,
      //whatsappEnabled: value === "chat" ? false : state.whatsappEnabled
      whatsappEnabled: value === "chat" ? state.whatsappEnabled : false,
    });
  }; */

  const handleBotTypeChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      botType: value as BotType,
      totalPrice: value === "chat" ? 1999 : 0, // Ensure Voice Bot starts with a default price
      whatsappEnabled: value === "chat" ? prev.whatsappEnabled : false, // Reset WhatsApp for Voice
    }));
  };

  return (
    <div className="bg-auth0-darker rounded-lg p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <Tabs
              defaultValue="voice"
              value={state.botType}
              onValueChange={handleBotTypeChange} // Use the new handler
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Chat Bot</TabsTrigger>
                <TabsTrigger value="voice">Voice Bot</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Label
                htmlFor="billing-toggle"
                className={state.billingCycle === "monthly" ? "font-bold" : ""}
              >
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={state.billingCycle === "yearly"}
                onCheckedChange={toggleBillingCycle}
              />
              <Label
                htmlFor="billing-toggle"
                className={state.billingCycle === "yearly" ? "font-bold" : ""}
              >
                Yearly{" "}
                <span className="text-green-600 text-sm">(Save 20%)</span>
              </Label>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8">
            {state.botType === "chat" ? (
              <ChatBotPricing state={state} updateState={updateState} />
            ) : (
              <VoiceBotPricing state={state} updateState={updateState} />
            )}
          </div>

          <FeatureComparisonTable
            botType={state.botType}
            activeComponents={state.activeComponents}
          />
        </div>

        <div className="lg:w-80">
          <PriceSummaryCard
            state={state}
            displayPrice={displayPrice}
            yearlyDiscount={yearlyDiscount}
          />
        </div>
      </div>
    </div>
  );
}
