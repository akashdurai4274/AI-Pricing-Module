"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PricingState } from "./pricing-module";

interface PriceSummaryCardProps {
  state: PricingState;
  displayPrice: string;
  yearlyDiscount: number;
}

export default function PriceSummaryCard({
  state,
  displayPrice,
  yearlyDiscount,
}: PriceSummaryCardProps) {
  // Calculate yearly savings with rounded numbers, no decimals
  const yearlySavings = Math.round(state.totalPrice * (1 - yearlyDiscount) * 12);
  
  return (
    <div className="sticky top-8">
      <Card className="shadow-lg border-gray-700 bg-auth0-dark">
        <CardHeader className="bg-auth0-darker border-b border-gray-700">
          <CardTitle className="text-xl">Price Summary</CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-medium">Total Price</span>
            <div className="text-right">
              <span className="text-3xl font-bold">
                ₹{Math.floor(parseFloat(displayPrice)).toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-gray-400 block">
                per {state.billingCycle === "monthly" ? "month" : "year"}
              </span>
            </div>
          </div>

          {state.billingCycle === "yearly" && (
            <div className="bg-green-900/20 text-green-400 p-3 rounded-md text-sm border border-green-800">
              You save ₹{yearlySavings.toLocaleString('en-IN')} with annual billing
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-gray-700">
            <h4 className="font-medium">Plan Details:</h4>

            {state.botType === "chat" ? (
              <>
                <div className="flex justify-between text-sm">
                  <span>Chat Sessions</span>
                  <span>{state.chatSessions.toLocaleString()}</span>
                </div>
                {state.whatsappEnabled && (
                  <div className="flex justify-between text-sm">
                    <span>WhatsApp Integration</span>
                    <span>Enabled (+$0.50)</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span>Voice Minutes</span>
                  <span>{state.voiceMinutes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Voice Provider</span>
                  <span className="capitalize">{state.voiceProvider}</span>
                </div>
              </>
            )}

            <div className="flex justify-between text-sm">
              <span>Billing Cycle</span>
              <span className="capitalize">{state.billingCycle}</span>
            </div>
          </div>

          {state.botType === "voice" && state.activeComponents && (
            <div className="space-y-3 pt-4 border-t border-gray-700">
              <h4 className="font-medium">Active Components:</h4>
              {state.activeComponents.map((component) => (
                <div key={component} className="flex justify-between text-sm">
                  <span className="capitalize">{component}</span>
                  <span>Enabled</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 p-6 pt-0">
          <Button className="w-full" size="lg">
            Get Started
          </Button>
          <p className="text-xs text-center text-gray-400">
            No credit card required. Start your 14-day free trial today.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
