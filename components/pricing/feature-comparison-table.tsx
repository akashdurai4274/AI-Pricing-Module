"use client"

import { Check, HelpCircle, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { BotType } from "./pricing-module"

// Update the FeatureComparisonTableProps interface to include activeComponents
interface FeatureComparisonTableProps {
  botType: BotType
  activeComponents?: string[]
}

// Update the Feature interface to include requiredComponent
interface Feature {
  name: string
  description: string
  chatSupport: boolean
  voiceSupport: boolean
  requiredComponent?: string
}

// Update the FEATURES array to include requiredComponent
const FEATURES: Feature[] = [
  {
    name: "24/7 Availability",
    description: "Your bot is available to answer questions around the clock",
    chatSupport: true,
    voiceSupport: true,
  },
  {
    name: "Multi-language Support",
    description: "Support for multiple languages to serve a global audience",
    chatSupport: true,
    voiceSupport: true,
  },
  {
    name: "Custom Knowledge Base",
    description: "Train your bot with your own data and documents",
    chatSupport: true,
    voiceSupport: true,
  },
  {
    name: "Analytics Dashboard",
    description: "Track usage, popular questions, and user satisfaction",
    chatSupport: true,
    voiceSupport: true,
  },
  {
    name: "WhatsApp Integration",
    description: "Connect your bot to WhatsApp for messaging",
    chatSupport: true,
    voiceSupport: false,
  },
  {
    name: "Voice Recognition",
    description: "Advanced speech-to-text capabilities",
    chatSupport: false,
    voiceSupport: true,
    requiredComponent: "tringai",
  },
  {
    name: "Natural Voice Synthesis",
    description: "Lifelike text-to-speech for voice responses",
    chatSupport: false,
    voiceSupport: true,
    requiredComponent: "elevenlabs",
  },
  {
    name: "Call Forwarding",
    description: "Forward calls to human agents when needed",
    chatSupport: false,
    voiceSupport: true,
    requiredComponent: "plivo",
  },
  {
    name: "Live Chat Handoff",
    description: "Seamlessly transfer to human agents",
    chatSupport: true,
    voiceSupport: false,
  },
  {
    name: "File Attachments",
    description: "Send and receive files in chat",
    chatSupport: true,
    voiceSupport: false,
  },
  {
    name: "Advanced Voice Analytics",
    description: "Detailed analysis of voice interactions and sentiment",
    chatSupport: false,
    voiceSupport: true,
    requiredComponent: "vapi",
  },
  {
    name: "Custom Voice Model",
    description: "Use your own custom voice model for responses",
    chatSupport: false,
    voiceSupport: true,
    requiredComponent: "custom",
  },
]

// Update the component to use activeComponents
export default function FeatureComparisonTable({ botType, activeComponents = [] }: FeatureComparisonTableProps) {
  // Filter features based on bot type and active components
  const relevantFeatures = FEATURES.filter((feature) => {
    // First filter by bot type
    const botTypeMatch = botType === "chat" ? feature.chatSupport : feature.voiceSupport

    // If voice bot, also check if the feature is enabled by active components
    if (botType === "voice" && feature.requiredComponent) {
      return botTypeMatch && activeComponents.includes(feature.requiredComponent)
    }

    return botTypeMatch
  })

  return (
    <div className="bg-auth0-dark rounded-lg p-6 mb-8 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6">Features & Capabilities</h2>

      <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="w-[50%] text-white">Feature</TableHead>
              <TableHead className="text-white">Included</TableHead>
              <TableHead className="text-white">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relevantFeatures.map((feature, index) => (
              <TableRow key={index} className="hover:bg-auth0-darker border-gray-700">
                <TableCell className="font-medium">{feature.name}</TableCell>
                <TableCell>
                  {botType === "chat" ? (
                    feature.chatSupport ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )
                  ) : feature.voiceSupport ? (
                    <Check className="text-green-500" />
                  ) : (
                    <X className="text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80">{feature.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TooltipProvider>
    </div>
  )
}

