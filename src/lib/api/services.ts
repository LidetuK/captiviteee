// Backend services for features, solutions, and industries

import { features, specializedSolutions, industryUseCases } from "./features";

export interface FeatureService {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface PricingTier {
  id: string;
  name: string;
  basePrice: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: string[];
  includedServices: string[];
  link: string;
  isPopular?: boolean;
}

// Available services for purchase
export const services: FeatureService[] = [
  {
    id: "textback",
    name: "Text Back Feature",
    price: 297.99,
    description: "AI-powered automated text response system",
    features: [
      "Smart response suggestions",
      "Automated follow-ups",
      "Message scheduling",
      "Analytics dashboard",
    ],
  },
  {
    id: "reputation",
    name: "Reputation Management",
    price: 347.99,
    description: "Complete review and reputation monitoring",
    features: [
      "Review monitoring",
      "Sentiment analysis",
      "Response automation",
      "Reputation scoring",
    ],
  },
  {
    id: "scheduling",
    name: "Smart Scheduling",
    price: 297.99,
    description: "AI-powered appointment management",
    features: [
      "Automated booking",
      "Calendar optimization",
      "Smart reminders",
      "No-show prevention",
    ],
  },
  {
    id: "tech-support",
    name: "Tech Support AI",
    price: 397.99,
    description: "AI trained on your documentation for technical support",
    features: [
      "Documentation integration",
      "24/7 automated support",
      "Ticket reduction analytics",
      "Knowledge base builder",
    ],
  },
  {
    id: "research",
    name: "Research & Lead Gen",
    price: 447.99,
    description: "AI-powered research and lead generation",
    features: [
      "Domain-specific research",
      "Lead qualification",
      "Competitive analysis",
      "Outreach automation",
    ],
  },
  {
    id: "travel-bot",
    name: "Travel Agency Bot",
    price: 397.99,
    description: "Multi-channel communication for travel agencies",
    features: [
      "Booking assistance",
      "Itinerary management",
      "Follow-up automation",
      "Cross-channel communication",
    ],
  },
  {
    id: "billing-assistant",
    name: "Billing Assistant",
    price: 397.99,
    description: "Secure assistant for billing inquiries",
    features: [
      "Secure authentication",
      "Billing software integration",
      "Payment processing",
      "Invoice explanation",
    ],
  },
  {
    id: "legal-assistant",
    name: "Legal Assistant",
    price: 497.99,
    description: "AI for legal document review and client intake",
    features: [
      "Document analysis",
      "Case research",
      "Client intake automation",
      "Compliance checking",
    ],
  },
  {
    id: "education-bot",
    name: "Education Assistant",
    price: 397.99,
    description: "AI tutor and administrative support",
    features: [
      "Student support",
      "Course material assistance",
      "Administrative automation",
      "Enrollment management",
    ],
  },
  {
    id: "product-advisor",
    name: "Product Advisor",
    price: 347.99,
    description: "AI product recommendation and configuration",
    features: [
      "Personalized recommendations",
      "Configuration assistance",
      "Feature comparison",
      "Technical guidance",
    ],
  },
  {
    id: "marketing-assistant",
    name: "Marketing Assistant",
    price: 447.99,
    description: "AI content creation and campaign management",
    features: [
      "Content generation",
      "Campaign analysis",
      "Audience segmentation",
      "Competitive intelligence",
    ],
  },
];

// Pricing tiers
export const pricingTiers: PricingTier[] = [
  {
    id: "single",
    name: "Single Service",
    basePrice: {
      monthly: 297.99,
      yearly: 238.39,
    },
    description: "Start with one core service",
    features: [
      "Choose any one service",
      "45-day money-back guarantee",
      "Basic support",
      "Service updates",
    ],
    includedServices: [],
    link: "/CAPTIVITE-X/get-started?plan=single",
  },
  {
    id: "business",
    name: "Business Bundle",
    basePrice: {
      monthly: 747.99,
      yearly: 598.39,
    },
    description: "Most popular for growing businesses",
    features: [
      "Choose any three services",
      "45-day money-back guarantee",
      "Priority support",
      "Quarterly strategy review",
      "Integration support",
    ],
    includedServices: [],
    link: "/CAPTIVITE-X/get-started?plan=business",
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    basePrice: {
      monthly: 1497.99,
      yearly: 1198.39,
    },
    description: "Custom solutions for large organizations",
    features: [
      "All services included",
      "45-day money-back guarantee",
      "24/7 dedicated support",
      "Monthly strategy sessions",
      "Custom integrations",
      "Advanced API access",
    ],
    includedServices: ["all"],
    link: "/CAPTIVITE-X/contact-sales",
  },
];

// Service API endpoints
export const getServices = () => {
  return services;
};

export const getServiceById = (id: string) => {
  return services.find((service) => service.id === id);
};

export const getPricingTiers = () => {
  return pricingTiers;
};

export const getPricingTierById = (id: string) => {
  return pricingTiers.find((tier) => tier.id === id);
};

// Calculate pricing for custom selections
export const calculateCustomPrice = (serviceIds: string[]) => {
  const selectedServices = services.filter((service) =>
    serviceIds.includes(service.id),
  );

  // Calculate total price
  const totalPrice = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0,
  );

  // Apply discount based on number of services
  let discount = 0;
  if (selectedServices.length >= 3) {
    discount = 0.15; // 15% discount for 3+ services
  } else if (selectedServices.length === 2) {
    discount = 0.1; // 10% discount for 2 services
  }

  const discountedPrice = totalPrice * (1 - discount);

  return {
    originalPrice: totalPrice,
    discountedPrice: discountedPrice,
    discount: discount * 100,
    services: selectedServices,
  };
};

// Get recommended services for an industry
export const getRecommendedServicesForIndustry = (industryId: string) => {
  const industry = industryUseCases.find((i) => i.id === industryId);
  if (!industry) return [];

  // In a real implementation, this would use more sophisticated matching logic
  // For now, we'll use a simplified approach
  switch (industryId) {
    case "healthcare":
      return services.filter((s) =>
        ["scheduling", "billing-assistant", "tech-support"].includes(s.id),
      );
    case "real-estate":
      return services.filter((s) =>
        ["scheduling", "research", "textback"].includes(s.id),
      );
    case "travel":
      return services.filter((s) =>
        ["travel-bot", "scheduling", "reputation"].includes(s.id),
      );
    case "legal":
      return services.filter((s) =>
        ["legal-assistant", "scheduling", "research"].includes(s.id),
      );
    case "retail":
      return services.filter((s) =>
        ["product-advisor", "reputation", "textback"].includes(s.id),
      );
    case "technology":
      return services.filter((s) =>
        ["tech-support", "product-advisor", "research"].includes(s.id),
      );
    default:
      // Return a default set of services
      return services.filter((s) =>
        ["textback", "scheduling", "reputation"].includes(s.id),
      );
  }
};
