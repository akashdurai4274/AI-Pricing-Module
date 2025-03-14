"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PricingState } from "./pricing-module";

interface DynamicPricingBarProps {
  state: PricingState;
  updateState: (newState: Partial<PricingState>) => void;
}

interface PricingComponent {
  id: string;
  name: string;
  icon: string;
  pricePerMinute: number;
  color: string;
  isDefault?: boolean;
  isActive: boolean;
  category: "transcription" | "model" | "voice" | "telephony" | "api";
}

export default function DynamicPricingBar({
  state,
  updateState,
}: DynamicPricingBarProps) {
  // Define all available pricing components
  const [components, setComponents] = useState<PricingComponent[]>([
    // Transcription options
    {
      id: "tringai",
      name: "Tring AI",
      icon: "tring.png",
      pricePerMinute: 0.0, // Free default
      color: "#4a3b7f",
      isDefault: true,
      isActive: true,
      category: "transcription",
    },
    {
      id: "google",
      name: "Google",
      icon: "/placeholder.svg?height=40&width=40",
      pricePerMinute: 0.01,
      color: "#4285F4",
      isActive: false,
      category: "transcription",
    },

    // Voice options
    {
      id: "elevenlabs",
      name: "ElevenLabs",
      icon: "/placeholder.svg?height=40&width=40",
      pricePerMinute: 0.07,
      color: "#5e7343",
      isActive: true,
      category: "voice",
    },

    // Telephony options
    {
      id: "plivo",
      name: "Plivo",
      icon: "/placeholder.svg?height=40&width=40",
      pricePerMinute: 0.0, // Free default
      color: "#7d3b4a",
      isDefault: true,
      isActive: true,
      category: "telephony",
    },
    {
      id: "twilio",
      name: "Twilio",
      icon: "/placeholder.svg?height=40&width=40",
      pricePerMinute: 0.02,
      color: "#F22F46",
      isActive: false,
      category: "telephony",
    },
    {
      id: "exotel",
      name: "Exotel",
      icon: "/placeholder.svg?height=40&width=40",
      pricePerMinute: 0.02,
      color: "#8B4513",
      isActive: false,
      category: "telephony",
    },

    // API options
    {
      id: "vapi",
      name: "VAPI",
      icon: "/placeholder.svg?height=40&width=40",
      pricePerMinute: 0.05,
      color: "#3b7f6f",
      isActive: true,
      category: "api",
    },

    // Model options
    {
      id: "custom",
      name: "Model (custom)",
      icon: "/placeholder.svg?height=40&width=40",
      pricePerMinute: 0.04,
      color: "#3b4a7f",
      isActive: true,
      category: "model",
    },
  ]);

  // Initialize components from state.activeComponents if available
  useEffect(() => {
    if (state.activeComponents && state.activeComponents.length > 0) {
      setComponents((prev) =>
        prev.map((comp) => ({
          ...comp,
          isActive:
            state.activeComponents?.includes(comp.id) ||
            comp.isDefault ||
            false,
        }))
      );
    }
  }, []);

  // Calculate total price per minute
  const calculateTotalPricePerMinute = () => {
    return components
      .filter((comp) => comp.isActive)
      .reduce((total, comp) => total + comp.pricePerMinute, 0);
  };

  // Update total price when components change
  useEffect(() => {
    const pricePerMinute = calculateTotalPricePerMinute();
    const totalPrice = pricePerMinute * state.voiceMinutes;
    updateState({
      totalPrice,
      activeComponents: components.filter((c) => c.isActive).map((c) => c.id),
    });
  }, [components, state.voiceMinutes]);

  /*  // Toggle component active state
  const toggleComponent = (id: string) => {
    setComponents((prev) =>
      prev.map((comp) => {
        // Don't allow deactivating default components
        if (comp.id === id && !comp.isDefault) {
          return { ...comp, isActive: !comp.isActive }
        }
        // If in same category and not default, ensure only one is active per category
        if (comp.category === prev.find((c) => c.id === id)?.category && !comp.isDefault && comp.id !== id) {
          return { ...comp, isActive: comp.isActive && comp.isDefault }
        }
        return comp
      }),
    )
  } */

  // Get active component for a category
  const getActiveComponentForCategory = (category: string) => {
    return components.find(
      (comp) => comp.category === category && comp.isActive
    );
  };

  // Calculate total width percentage
  const totalPrice = calculateTotalPricePerMinute();

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">Voice Service Components</h3>

      <div className="flex flex-col space-y-6">
        {/* Dynamic pricing bar */}
        <div className="relative h-20 rounded-full overflow-hidden bg-gray-800 shadow-inner">
          {components
            .filter((comp) => comp.isActive)
            .map((comp, index, arr) => {
              // Calculate width percentage based on price contribution
              const widthPercentage =
                totalPrice === 0
                  ? 100 / arr.length
                  : (comp.pricePerMinute / totalPrice) * 100;
              // Calculate left position based on previous components
              const leftPosition = arr
                .slice(0, index)
                .reduce(
                  (total, c) =>
                    totalPrice === 0
                      ? total + 100 / arr.length
                      : total + (c.pricePerMinute / totalPrice) * 100,
                  0
                );

              return (
                <div
                  key={comp.id}
                  className="absolute top-0 bottom-0 flex items-center justify-center"
                  style={{
                    left: `${leftPosition}%`,
                    width: `${widthPercentage}%`,
                    backgroundColor: comp.color,
                  }}
                >
                  <div className="text-white font-bold text-xl">
                    {comp.pricePerMinute === 0
                      ? "Free"
                      : `${comp.pricePerMinute.toFixed(2)}¢/min`}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Component icons with labels */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {/* Transcription */}
          <div className="flex flex-col items-center">
            <div className="text-center mb-2">Transcriber</div>
            <TooltipProvider>
              {components
                .filter((comp) => comp.category === "transcription")
                .map((comp) => (
                  <Tooltip key={comp.id}>
                    <TooltipTrigger asChild>
                      <button
                       // onClick={() => toggleComponent(comp.id)}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                          comp.isActive ? "ring-2 ring-primary" : "opacity-50"
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"
                          style={{
                            backgroundColor: comp.isActive
                              ? comp.color
                              : undefined,
                          }}
                        >
                          {comp.name.charAt(0)}
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {comp.name} (
                        {comp.pricePerMinute === 0
                          ? "Free"
                          : `${comp.pricePerMinute.toFixed(2)}¢/min`}
                        )
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </TooltipProvider>
          </div>

          {/* Model */}
          <div className="flex flex-col items-center">
            <div className="text-center mb-2">Model</div>
            <TooltipProvider>
              {components
                .filter((comp) => comp.category === "model")
                .map((comp) => (
                  <Tooltip key={comp.id}>
                    <TooltipTrigger asChild>
                      <button
                        //onClick={() => toggleComponent(comp.id)}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                          comp.isActive ? "ring-2 ring-primary" : "opacity-50"
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"
                          style={{
                            backgroundColor: comp.isActive
                              ? comp.color
                              : undefined,
                          }}
                        >
                          {comp.name.charAt(0)}
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {comp.name} ({comp.pricePerMinute.toFixed(2)}¢/min)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </TooltipProvider>
            <div className="text-xs text-gray-400">(custom)</div>
          </div>

          {/* Voice */}
          <div className="flex flex-col items-center">
            <div className="text-center mb-2">Voice</div>
            <TooltipProvider>
              {components
                .filter((comp) => comp.category === "voice")
                .map((comp) => (
                  <Tooltip key={comp.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleComponent(comp.id)}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                          comp.isActive ? "ring-2 ring-primary" : "opacity-50"
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"
                          style={{
                            backgroundColor: comp.isActive
                              ? comp.color
                              : undefined,
                          }}
                        >
                          {comp.name.charAt(0)}
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {comp.name} ({comp.pricePerMinute.toFixed(2)}¢/min)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </TooltipProvider>
          </div>

          {/* Telephony */}
          <div className="flex flex-col items-center">
            <div className="text-center mb-2">Telephony</div>
            <TooltipProvider>
              {components
                .filter((comp) => comp.category === "telephony")
                .map((comp) => (
                  <Tooltip key={comp.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleComponent(comp.id)}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                          comp.isActive ? "ring-2 ring-primary" : "opacity-50"
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"
                          style={{
                            backgroundColor: comp.isActive
                              ? comp.color
                              : undefined,
                          }}
                        >
                          {comp.name.charAt(0)}
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {comp.name} (
                        {comp.pricePerMinute === 0
                          ? "Free"
                          : `${comp.pricePerMinute.toFixed(2)}¢/min`}
                        )
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </TooltipProvider>
          </div>

          {/* API */}
          <div className="flex flex-col items-center">
            <div className="text-center mb-2">VAPI</div>
            <TooltipProvider>
              {components
                .filter((comp) => comp.category === "api")
                .map((comp) => (
                  <Tooltip key={comp.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleComponent(comp.id)}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                          comp.isActive ? "ring-2 ring-primary" : "opacity-50"
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"
                          style={{
                            backgroundColor: comp.isActive
                              ? comp.color
                              : undefined,
                          }}
                        >
                          {comp.name.charAt(0)}
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {comp.name} ({comp.pricePerMinute.toFixed(2)}¢/min)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </TooltipProvider>
          </div>
        </div>

        {/* Total price per minute */}
        <div className="text-center text-xl font-bold">
          Total:{" "}
          {totalPrice === 0 ? "Free" : `${totalPrice.toFixed(2)}¢ per minute`}
        </div>
      </div>
    </div>
  );
}
