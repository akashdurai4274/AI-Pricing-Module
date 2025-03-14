export interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number | null;
  features: string[];
  maxUsers: number | null;
  buttonText: string;
  buttonAction: "start" | "signup" | "contact";
}

// Base pricing tiers
export const BASE_PRICING_TIERS = [
  {
    name: "Free",
    basePrice: 0,
    baseSessions: 50,
    features: ["Basic customization", "1 chatbot", "Limited features"],
  },
  {
    name: "Basic",
    basePrice: 1999,
    baseSessions: 60,
    features: ["Widget customization", "2 chatbots", "200 extra messages"],
  },
  {
    name: "Professional",
    basePrice: 6999,
    baseSessions: 250,
    features: ["Advanced customization", "10 chatbots", "1000 extra messages"],
  },
  {
    name: "Enterprise",
    basePrice: "Custom",
    baseSessions: 1000,
    features: [
      "Unlimited features",
      "Unlimited chatbots",
      "Unlimited messages",
    ],
  },
];

// Dynamic price calculation function
export function calculateDynamicPrice(sessions: number): number {
  // Free tier (up to 50 sessions)
  if (sessions <= 50) {
    return 0;
  }

  // Find the appropriate pricing tier
  if (sessions <= 60) {
    // Basic tier calculation (51-60 sessions)
    const basePrice = 1999;
    const extraSessions = sessions - 50;
    return basePrice * (extraSessions / 10); // Linear scaling for first tier
  }

  if (sessions <= 250) {
    // Professional tier calculation (61-250 sessions)
    const basePrice = 1999;
    const proPrice = 6999;
    const ratio = (sessions - 60) / (250 - 60);
    return basePrice + (proPrice - basePrice) * ratio;
  }

  if (sessions <= 1000) {
    // Enterprise tier calculation (251-1000 sessions)
    const baseProPrice = 6999;
    const extraSessions = sessions - 250;
    const extraCost = extraSessions * (baseProPrice / 250); // Scale based on pro tier
    return baseProPrice + extraCost;
  }

  // Custom pricing for over 1000 sessions
  return -1; // Indicates "Contact Sales"
}

// Helper function to get price display text
export function getPriceDisplay(sessions: number): string {
  const price = calculateDynamicPrice(sessions);

  if (price === 0) return "Free";
  if (price === -1) return "Contact Sales";

  return `₹${Math.round(price).toLocaleString()}`;
}

// Get appropriate tier based on session count
export function getCurrentTier(sessions: number): string {
  if (sessions <= 50) return "Free";
  if (sessions <= 60) return "Basic";
  if (sessions <= 250) return "Professional";
  return "Enterprise";
}

// Calculate extra features based on tier
export function getExtraFeatures(sessions: number): any {
  const tier = getCurrentTier(sessions);

  switch (tier) {
    case "Free":
      return {
        extraMessages: 0,
        chatbots: 1,
        customization: "Basic",
        extraMessageCost: 0,
      };
    case "Basic":
      return {
        extraMessages: 200,
        chatbots: 2,
        customization: "Standard",
        extraMessageCost: 10,
      };
    case "Professional":
      return {
        extraMessages: 1000,
        chatbots: 10,
        customization: "Advanced",
        extraMessageCost: 8,
      };
    case "Enterprise":
      return {
        extraMessages: "Unlimited",
        chatbots: "Unlimited",
        customization: "Full",
        extraMessageCost: "Custom",
      };
    default:
      return {
        extraMessages: 0,
        chatbots: 1,
        customization: "Basic",
        extraMessageCost: 0,
      };
  }
}

export interface UserTierPrice {
  users: number;
  essentialsPrice: number | null;
  professionalPrice: number | null;
}

// Pricing tiers based on user count
export const CHAT_USER_TIER_PRICES: UserTierPrice[] =
  /* [
  { users: 60, essentialsPrice: 1999, professionalPrice: 6999 },
  { users: 100, essentialsPrice: 1666, professionalPrice: 2800 },
  { users: 250, essentialsPrice: 9999, professionalPrice: 24999 },
  { users: 500, essentialsPrice: 19999, professionalPrice: null },
    { users: 750, essentialsPrice: 29999, professionalPrice: 74999 },
    { users: 1000, essentialsPrice: null, professionalPrice: null },
  { users: 2000, essentialsPrice: null, professionalPrice: null },
  { users: 3000, essentialsPrice: null, professionalPrice: null },
]; */

  [
    { users: 60, essentialsPrice: 1999, professionalPrice: 6999 },
    { users: 100, essentialsPrice: 3332 * 10, professionalPrice: 11665 * 8 },
    { users: 150, essentialsPrice: 4997 * 10, professionalPrice: 17497 * 8 },
    { users: 200, essentialsPrice: 6662 * 10, professionalPrice: 23330 * 8 },
    { users: 250, essentialsPrice: 8328 * 10, professionalPrice: 29165 * 8 },
    { users: 300, essentialsPrice: 9993 * 10, professionalPrice: null },
    { users: 350, essentialsPrice: null, professionalPrice: null },
    { users: 400, essentialsPrice: null, professionalPrice: null },
    { users: 450, essentialsPrice: null, professionalPrice: null },
    { users: 500, essentialsPrice: null, professionalPrice: null },
  ];

export const VOICE_USER_TIER_PRICES: UserTierPrice[] = [
  { users: 1500, essentialsPrice: 14999, professionalPrice: 39999 },
  { users: 2500, essentialsPrice: 24999 * 6, professionalPrice: 64999 * 5 },
  { users: 3500, essentialsPrice: 34999 * 6, professionalPrice: 94999 * 5 },
  { users: 4500, essentialsPrice: 44999 * 6, professionalPrice: null },
  { users: 5500, essentialsPrice: null, professionalPrice: null },
  { users: 6500, essentialsPrice: null, professionalPrice: null },
  { users: 7500, essentialsPrice: null, professionalPrice: null },
];

/* 500, 1000, 2000, 3000 */
export const PRICING_FEATURES = {
  authentication: [
    {
      name: "External Active Users",
      description: "Number of unique users that can authenticate per month",
      free: "Up to 25,000",
      essentials: "Custom Tiers Available",
      professional: "Custom Tiers Available",
      enterprise: "Custom Tiers Available",
    },
    {
      name: "Machine to Machine Authentication",
      description: "Number of M2M tokens that can be generated per month",
      free: "1,000",
      essentials: "1,000",
      professional: "5,000",
      enterprise: "5,000",
    },
    {
      name: "M2M Add-on",
      description: "Additional M2M authentication capabilities",
      free: false,
      essentials: false,
      professional: true,
      enterprise: true,
    },
    {
      name: "Passwordless",
      description: "Email and SMS passwordless login",
      free: true,
      essentials: true,
      professional: true,
      enterprise: true,
    },
    {
      name: "Social Connections",
      description: "Login with social providers",
      free: "Unlimited**",
      essentials: "Unlimited**",
      professional: "Unlimited**",
      enterprise: "Unlimited**",
    },
    {
      name: "Custom Social Connections",
      description: "Create your own social connections",
      free: true,
      essentials: true,
      professional: true,
      enterprise: true,
    },
    {
      name: "Passkeys",
      description: "Support for FIDO2 passkeys",
      free: true,
      essentials: true,
      professional: true,
      enterprise: true,
    },
    {
      name: "Auth0 Database Connection",
      description: "Store user credentials in Auth0",
      free: true,
      essentials: true,
      professional: true,
      enterprise: true,
    },
  ],
  branding: [
    {
      name: "Configurable Login Experience",
      description: "Customize the login interface",
      free: true,
      essentials: true,
      professional: true,
      enterprise: true,
    },
    {
      name: "Accessibility",
      description: "WCAG 2.1 AA compliant login experience",
      free: true,
      essentials: true,
      professional: true,
      enterprise: true,
    },
    {
      name: "Custom Domains",
      description: "Use your own domain for authentication",
      free: "1",
      essentials: true,
      professional: true,
      enterprise: true,
    },
    {
      name: "Email Workflow",
      description: "Customize email templates and workflows",
      free: false,
      essentials: true,
      professional: true,
      enterprise: true,
    },
  ],
  security: [
    {
      name: "Multi-Factor Authentication",
      description: "Add an extra layer of security",
      free: false,
      essentials: false,
      professional: true,
      enterprise: true,
    },
    {
      name: "Enhanced Attack Protection",
      description: "Advanced security features",
      free: false,
      essentials: false,
      professional: true,
      enterprise: true,
    },
    {
      name: "Home Realm Discovery",
      description: "Automatically route users to their identity provider",
      free: false,
      essentials: false,
      professional: false,
      enterprise: true,
    },
    {
      name: "Long Lived Sessions",
      description: "Extended session duration",
      free: false,
      essentials: false,
      professional: false,
      enterprise: true,
    },
  ],
  organizations: [
    {
      name: "Organizations",
      description: "Number of organizations you can create",
      free: "5",
      essentials: "10",
      professional: "10",
      enterprise: "Unlimited",
    },
  ],
};

export const ENTERPRISE_ADDONS = [
  {
    title: "Fine Grained Authorization",
    description:
      "A highly scalable authorization service for developers that helps them implement authorization for any kind of application, and enable user collaboration and granular access control using easy-to-use APIs. Available in Public Cloud and Private Cloud AWS.",
    icon: "Lock",
  },
  {
    title: "Attack Protection",
    description:
      "Keep your users and services safe from password leaks, intruders, and scripted attacks from bots. Protect and notify your users when credentials are leaked or during an attempted account takeover.",
    icon: "Shield",
  },
  {
    title: "Private Cloud",
    description:
      "A low-friction, dedicated Auth0 deployment model for enhanced performance, security, and compliance over our standard public cloud offering.",
    icon: "Cloud",
  },
  {
    title: "Adaptive MFA",
    description:
      "Protect against malicious attacks with minimal impact to your users. Adaptive MFA is designed to only be triggered when a login is suspected to be risky via different risk profiles.",
    icon: "Fingerprint",
  },
  {
    title: "Machine to Machine Tokens",
    description:
      "Easily facilitate secure communication between your API and both first-party and third-party applications.",
    icon: "Server",
  },
  {
    title: "Highly Regulated Identity",
    description:
      "Secure sensitive customer operations beyond login with Financial-grade API (FAPI) and Strong Customer Authentication (SCA) compliance.",
    icon: "ShieldCheck",
  },
];

export const CHAT_BOT_FEATURES = {
  features: [
    {
      name: "Message Sessions",
      free: "50",
      essentials: "60",
      professional: "250",
      enterprise: "1000+"
    },
    {
      name: "Duration",
      free: "Lifetime",
      essentials: "Month",
      professional: "Month",
      enterprise: "Month"
    },
    {
      name: "Extra message cost",
      free: "✕",
      essentials: "Rs.10",
      professional: "Rs.8",
      enterprise: "Talk to sales"
    },
    {
      name: "Extra message limit",
      free: "✕",
      essentials: "200",
      professional: "1000",
      enterprise: "Unlimited"
    },
    {
      name: "No of chatbots",
      free: "1",
      essentials: "2",
      professional: "10",
      enterprise: "Unlimited"
    },
    {
      name: "Extra Chatbot cost",
      free: "✕",
      essentials: "Rs.1000",
      professional: "Rs.1000",
      enterprise: "Talk to sales"
    },
    {
      name: "Extra Chatbot Limit",
      free: "✕",
      essentials: "5",
      professional: "50",
      enterprise: "Unlimited"
    },
    {
      name: "Lead Gen",
      free: "✕",
      essentials: "✕",
      professional: "✓",
      enterprise: "✓"
    },
    {
      name: "CRM integration",
      free: "✕",
      essentials: "✕",
      professional: "✓",
      enterprise: "✓"
    },
    {
      name: "Widget Customization",
      free: "✕",
      essentials: "✓",
      professional: "Advance",
      enterprise: "Advance"
    },
    {
      name: "No Tring Branding",
      free: "✕",
      essentials: "✕",
      professional: "Paid",
      enterprise: "✓"
    }
  ]
};

export const VOICE_BOT_FEATURES = {
  features: [
    {
      name: "Mins",
      essentials: "1500",
      professional: "5000",
      enterprise: "10,000+"
    },
    {
      name: "Duration",
      essentials: "Month",
      professional: "Month",
      enterprise: "Month"
    },
    {
      name: "Extra mins cost",
      essentials: "Rs.6",
      professional: "Rs.5",
      enterprise: "Talk to sales"
    },
    {
      name: "Lead Gen",
      essentials: "✓",
      professional: "✓",
      enterprise: "✓"
    },
    {
      name: "CRM integration",
      essentials: "✓",
      professional: "✓",
      enterprise: "✓"
    },
    {
      name: "Voice Customization",
      essentials: "✓",
      professional: "Advance",
      enterprise: "Advance"
    },
    {
      name: "Custom Voice",
      essentials: "Included (Requires paid elevenlabs account)",
      professional: "Included (Requires paid elevenlabs account)",
      enterprise: "Included (Requires paid elevenlabs account)"
    },
    {
      name: "Action",
      essentials: "SMS/Whatsapp",
      professional: "SMS/Whatsapp",
      enterprise: "SMS/Whatsapp"
    },
    {
      name: "Real time booking",
      essentials: "✓",
      professional: "✓",
      enterprise: "✓"
    },
    {
      name: "Multi lingual",
      essentials: "✕",
      professional: "✓",
      enterprise: "✓"
    },
    {
      name: "White-glove onboarding",
      essentials: "Paid (Offer - free till Nov 15th 2024)",
      professional: "Paid (Offer - free till Nov 15th 2024)",
      enterprise: "Included"
    }
  ]
};
