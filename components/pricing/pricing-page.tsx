"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import EnterpriseAddons from "./enterprise-addons";
import FeatureComparison from "./feature-comparison";
import ChatBotPricingTiers from "./chat-pricing-tiers";
import VoiceBotPricingTiers from "./voice-pricing-tiers";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { CHAT_BOT_FEATURES, VOICE_BOT_FEATURES } from "@/lib/pricing-config";
import { Check, X } from "lucide-react";
import Image from "next/image";
type BusinessType = "chat" | "voice";
type BillingCycle = "monthly" | "yearly";

export default function PricingPage() {
  const [businessType, setBusinessType] = useState<BusinessType>("chat");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [activeSession, setActiveSession] = useState<number>(60);
  const [activeMinutes, setActiveMinutes] = useState<number>(50);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  // User count presets
  const sessions = [
    60, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000,
  ];
  const minutes = [1500, 2500, 3500, 4500, 5500, 6500, 7500, 8500];
  const CurrencyToggle = () => (
    <div className="flex justify-center items-end gap-4 mb-2 mt-2 ">
      <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-yellow-200 ">
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
    <div className="min-h-screen ">
      <div className="bg-gradient-to-tr from-yellow-50 to-white">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Image src="tring.png" alt="logo" width={80} height={80} />
              </div>
              <div className="hidden md:flex space-x-6 font-semibold">
                <a href="#" className="hover:text-gray-300">
                  Developers
                </a>
                <a href="#" className="hover:text-gray-300">
                  Documentation
                </a>
                <a href="#" className="hover:text-gray-300">
                  Product
                </a>
                <a href="#" className="hover:text-gray-300">
                  Solutions
                </a>
                <a href="#" className="hover:text-gray-300">
                  Blog
                </a>
                <a href="#" className="font-bold">
                  Pricing
                </a>
              </div>
              <div className="flex space-x-4">
                <Button className="hidden sm:block text-white bg-yellow-400 border-2  border-yellow-400 hover:bg-white hover:text-yellow-300 shadow-lg shadow-yellow-100">
                  Sign up
                </Button>
                <Button
                  variant="outline"
                  className="bg-white text-auth0-dark shadow-b-2 border-2 border-yellow-400 hover:bg-yellow-400"
                >
                  Contact sales
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-yellow-50 to-white">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Flexible pricing for{" "}
              <span className="bg-clip-text text-transparent bg-auth0-gradient">
                developers
              </span>
              {" & "}
              <span className="bg-clip-text text-transparent bg-auth0-gradient">
                companies
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-yellow-400 bg-yellow-400 hover:bg-white hover:text-yellow-400"
              >
                Start building for free
              </Button>
              <Button
                size="lg"
                className="bg-white text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-white"
              >
                Talk to our Sales team
              </Button>
            </div>
            <p className="mt-4 text-gray-400">
              Add authentication to your application today
            </p>
          </div>
        </section>

        {/* Pricing Controls */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-yellow-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {/* Business Type */}
              <div>
                <h3 className="text-xl font-medium mb-4">
                  What is your use case?
                </h3>
                <div className="rounded-md  border-2 border-yellow-200 h-[65px]">
                  <Tabs
                    value={businessType}
                    onValueChange={(value) =>
                      setBusinessType(value as BusinessType)
                    }
                    className="w-full bg-white "
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-transparent">
                      <TabsTrigger
                        value="chat"
                        className="rounded-md p-4 data-[state=active]:bg-yellow-400 data-[state=active]:text-auth0-dark data-[state=inactive]"
                      >
                        Chat Bot
                      </TabsTrigger>
                      <TabsTrigger
                        value="voice"
                        className="rounded-md p-4 data-[state=active]:bg-yellow-400 data-[state=active]:text-auth0-dark data-[state=inactive]"
                      >
                        Voice Bot
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Billing Cycle */}
              <div>
                <h3 className="text-xl font-medium mb-4">Billing</h3>
                <div className="rounded-md  border-2 border-yellow-200 h-[65px]">
                  <Tabs
                    value={billingCycle}
                    onValueChange={(value) =>
                      setBillingCycle(value as BillingCycle)
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-transparent">
                      <TabsTrigger
                        value="monthly"
                        className="rounded-md p-4 data-[state=active]:bg-yellow-400 data-[state=active]:text-auth0-dark data-[state=inactive]"
                      >
                        Monthly
                      </TabsTrigger>
                      <TabsTrigger
                        value="yearly"
                        className="rounded-md p-4 data-[state=active]:bg-yellow-400 data-[state=active]:text-auth0-dark data-[state=inactive]"
                      >
                        Yearly
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              <CurrencyToggle />

              {/* Chat Bot */}
            </div>
            {businessType === "chat" ? (
              <div className="mt-16 ">
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-medium">
                    How many Chat Sessions?
                  </h3>
                  <InfoIcon className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="my-4">
                  <Slider
                    value={[activeSession]}
                    min={60}
                    max={500}
                    step={1} // Small step size for precision
                    onValueChange={(value) => {
                      // Find the closest valid plan
                      const closestPlan = sessions.reduce((prev, curr) =>
                        Math.abs(curr - value[0]) < Math.abs(prev - value[0])
                          ? curr
                          : prev
                      );
                      setActiveSession(closestPlan); // Snap to the closest predefined value
                    }}
                    className="mb-6"
                  />
                </div>
                {/* <div className="flex justify-between text-sm text-gray-400"> */}
                <div className="flex flex-wrap justify-between gap-2 text-xs sm:text-sm text-gray-400">
                  {sessions.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setActiveSession(preset)}
                      className={`${
                        activeSession === preset ? "text-white font-bold" : ""
                      } ${preset > 500 ? "hidden sm:inline-block" : ""}`}
                    >
                      {preset >= 1000 ? `${preset / 1000}k` : preset}
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveSession(30000)}
                    className={`${
                      activeSession >= 30000 ? "text-white font-bold" : ""
                    }`}
                  ></button>
                </div>
              </div>
            ) : (
              // Voice Bot
              <div>
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-medium">
                    How many Voice Minutes?
                  </h3>
                  <InfoIcon className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mb-4">
                  <Slider
                    value={[activeMinutes]}
                    min={1500}
                    max={8500}
                    step={100} // Small step size for precision
                    onValueChange={(value) => {
                      const currentValue = value[0];

                      // Find the closest valid option in the `minutes` array
                      const closestPlan = minutes.reduce((prev, curr) =>
                        Math.abs(curr - currentValue) <
                        Math.abs(prev - currentValue)
                          ? curr
                          : prev
                      );

                      // Update state with the closest valid option
                      setActiveMinutes(closestPlan);
                    }}
                    className="mb-6"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  {minutes.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setActiveMinutes(preset)}
                      className={`${
                        activeMinutes === preset ? "text-white font-bold" : ""
                      }`}
                    >
                      {preset >= 1000 ? `${preset / 1000}k` : preset}
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveMinutes(30000)}
                    className={`${
                      activeMinutes >= 30000 ? "text-white font-bold" : ""
                    }`}
                  ></button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className=" px-4 sm:px-6 lg:px-8 ">
          <div className="container mx-auto max-w-6xl">
            <div className=" dark:bg-gray-900 rounded-lg ">
              {businessType === "chat" ? (
                <ChatBotPricingTiers
                  businessType={businessType}
                  billingCycle={billingCycle}
                  activeUsers={activeSession}
                  currency={currency}
                  setCurrency={setCurrency}
                />
              ) : (
                <VoiceBotPricingTiers
                  businessType={businessType}
                  billingCycle={billingCycle}
                  activeUsers={activeMinutes}
                  currency={currency}
                  setCurrency={setCurrency}
                />
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Enterprise Add-ons */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-yellow-50 ">
        <div className="container mx-auto max-w-6xl">
          <EnterpriseAddons />
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800 bg-gradient-to-r from-green-50 to-yellow-50">
        {/* <div className="text-2xl font-bold text-center mb-8">
          Chat Bot Comparison Table
        </div> */}
        <div className="container mx-auto max-w-6xl">
          {businessType === "chat" ? (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8">
                Chabot Comparison Table
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="w-[300px]">Features</TableHead>
                      <TableHead className="text-center">Free</TableHead>
                      <TableHead className="text-center">
                        Intelligence
                      </TableHead>
                      <TableHead className="text-center">
                        Super Intelligence
                      </TableHead>
                      <TableHead className="text-center">Enterprise</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CHAT_BOT_FEATURES.features.map((feature, index) => (
                      <TableRow key={index} className="border-gray-800">
                        <TableCell className="font-medium">
                          {feature.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {feature.free === "✓" ? (
                            <Check className="mx-auto text-green-500" />
                          ) : feature.free === "✕" ? (
                            <X className="mx-auto text-red-500" />
                          ) : (
                            feature.free
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {feature.essentials === "✓" ? (
                            <Check className="mx-auto text-green-500" />
                          ) : feature.essentials === "✕" ? (
                            <X className="mx-auto text-red-500" />
                          ) : (
                            feature.essentials
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {feature.professional === "✓" ? (
                            <Check className="mx-auto text-green-500" />
                          ) : feature.professional === "✕" ? (
                            <X className="mx-auto text-red-500" />
                          ) : (
                            feature.professional
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {feature.enterprise === "✓" ? (
                            <Check className="mx-auto text-green-500" />
                          ) : feature.enterprise === "✕" ? (
                            <X className="mx-auto text-red-500" />
                          ) : (
                            feature.enterprise
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8">
                Voice Bot Comparison Table
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="w-[300px]">Features</TableHead>
                      <TableHead className="text-center">
                        Intelligence
                      </TableHead>
                      <TableHead className="text-center">
                        Super Intelligence
                      </TableHead>
                      <TableHead className="text-center">Enterprise</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {VOICE_BOT_FEATURES.features.map((feature, index) => (
                      <TableRow key={index} className="border-gray-800">
                        <TableCell className="font-medium">
                          {feature.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {feature.essentials === "✓" ? (
                            <Check className="mx-auto text-green-500" />
                          ) : feature.essentials === "✕" ? (
                            <X className="mx-auto text-red-500" />
                          ) : (
                            feature.essentials
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {feature.professional === "✓" ? (
                            <Check className="mx-auto text-green-500" />
                          ) : feature.professional === "✕" ? (
                            <X className="mx-auto text-red-500" />
                          ) : (
                            feature.professional
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {feature.enterprise === "✓" ? (
                            <Check className="mx-auto text-green-500" />
                          ) : feature.enterprise === "✕" ? (
                            <X className="mx-auto text-red-500" />
                          ) : (
                            feature.enterprise
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
