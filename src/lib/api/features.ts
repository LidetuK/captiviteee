// Backend API for features

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  link: string;
  isNew?: boolean;
  comingSoon?: boolean;
}

export interface SpecializedSolution {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  example: string;
  industries: string[];
  link: string;
  isNew?: boolean;
  comingSoon?: boolean;
}

export interface IndustryUseCase {
  id: string;
  industry: string;
  description: string;
  icon: string;
  useCases: string[];
  link: string;
}

// Core features
export const features: Feature[] = [
  {
    id: "text-back",
    title: "Text-Back AI",
    description:
      "24/7 automated customer response system that handles inquiries instantly",
    icon: "MessageSquare",
    benefits: [
      "Instant responses to customer inquiries",
      "Personalized messaging based on customer history",
      "Multi-channel support (SMS, web, email)",
      "Seamless handoff to human agents when needed",
    ],
    link: "/CAPTIVITE-X/features/text-back",
  },
  {
    id: "scheduling",
    title: "Smart Scheduling",
    description:
      "AI-powered appointment management that eliminates double-bookings",
    icon: "Calendar",
    benefits: [
      "Intelligent calendar optimization",
      "Automated appointment reminders",
      "Self-service booking for customers",
      "Integration with popular calendar systems",
    ],
    link: "/CAPTIVITE-X/features/scheduling",
  },
  {
    id: "reputation",
    title: "Reputation Management",
    description:
      "Monitor and improve your online presence with automated review responses",
    icon: "Star",
    benefits: [
      "Review monitoring across platforms",
      "Sentiment analysis of customer feedback",
      "Automated response suggestions",
      "Reputation score tracking",
    ],
    link: "/CAPTIVITE-X/features/reputation",
  },
  {
    id: "analytics",
    title: "Analytics Dashboard",
    description:
      "Real-time business insights that help you make data-driven decisions",
    icon: "BarChart3",
    benefits: [
      "Customizable reporting dashboards",
      "Customer engagement metrics",
      "Performance trend analysis",
      "ROI calculation tools",
    ],
    link: "/CAPTIVITE-X/features/analytics",
  },
  {
    id: "ai-assistant",
    title: "AI Assistant",
    description:
      "Virtual assistant that handles tasks and provides intelligent support",
    icon: "Bot",
    benefits: [
      "Task automation and management",
      "Intelligent information retrieval",
      "Natural language understanding",
      "Contextual recommendations",
    ],
    link: "/CAPTIVITE-X/features/ai-assistant",
  },
  {
    id: "integrations",
    title: "Integration Hub",
    description:
      "Connect with your favorite tools like Salesforce, HubSpot, and more",
    icon: "Boxes",
    benefits: [
      "Pre-built connectors for popular platforms",
      "Custom API integration capabilities",
      "Data synchronization across systems",
      "Workflow automation between tools",
    ],
    link: "/CAPTIVITE-X/features/integrations",
  },
  {
    id: "tech-support",
    title: "Tech Support AI",
    description:
      "AI trained on your documentation to handle installations, troubleshooting and inquiries",
    icon: "FileText",
    benefits: [
      "24/7 technical support without human intervention",
      "Instant answers from your documentation",
      "Reduced support ticket volume",
      "Consistent and accurate troubleshooting",
    ],
    link: "/CAPTIVITE-X/features/tech-support",
  },
  {
    id: "research",
    title: "Research & Lead Gen",
    description:
      "AI-powered research and lead generation for specific domains, tags or niches",
    icon: "Search",
    benefits: [
      "Automated lead discovery and qualification",
      "Domain-specific research and insights",
      "Competitive intelligence gathering",
      "Targeted outreach recommendations",
    ],
    link: "/CAPTIVITE-X/features/research",
  },
  {
    id: "travel-bot",
    title: "Travel Agency Bot",
    description:
      "Multi-channel communication bot for travel inquiries with automated follow-ups",
    icon: "Phone",
    benefits: [
      "Handle inquiries via chat, email, text and calls",
      "Automated follow-ups for abandoned bookings",
      "24/7 availability for global customers",
      "Seamless handoff to human agents when needed",
    ],
    link: "/CAPTIVITE-X/features/travel-bot",
  },
  {
    id: "billing-assistant",
    title: "Billing Assistant",
    description:
      "Secure AI assistant for answering specific billing questions after authentication",
    icon: "CreditCard",
    benefits: [
      "Secure authentication before accessing billing data",
      "Instant answers to common billing questions",
      "Integration with existing billing software",
      "Reduced call center volume for billing inquiries",
    ],
    link: "/CAPTIVITE-X/features/billing-assistant",
  },
];

// Specialized solutions with detailed information
export const specializedSolutions: SpecializedSolution[] = [
  {
    id: "tech-support",
    title: "Tech Support AI",
    description:
      "AI trained on your documentation to handle installations, troubleshooting and inquiries",
    icon: "FileText",
    benefits: [
      "24/7 technical support without human intervention",
      "Instant answers from your documentation",
      "Reduced support ticket volume by up to 70%",
      "Consistent and accurate troubleshooting",
    ],
    example:
      "A software company trained our AI on their product documentation, reducing support tickets by 65% and improving customer satisfaction scores.",
    industries: ["Technology", "SaaS", "Manufacturing", "Telecommunications"],
    link: "/CAPTIVITE-X/features/tech-support",
  },
  {
    id: "research",
    title: "Research & Lead Generation",
    description:
      "AI-powered research and lead generation for specific domains, tags or niches",
    icon: "Search",
    benefits: [
      "Automated lead discovery and qualification",
      "Domain-specific research and insights",
      "Competitive intelligence gathering",
      "Targeted outreach recommendations",
    ],
    example:
      "A marketing agency uses our research AI to identify potential clients in the healthcare sector, generating 40+ qualified leads per week.",
    industries: ["Marketing", "Sales", "Consulting", "Real Estate"],
    link: "/CAPTIVITE-X/features/research",
  },
  {
    id: "travel-bot",
    title: "Travel Agency Bot",
    description:
      "Multi-channel communication bot for travel inquiries with automated follow-ups",
    icon: "Phone",
    benefits: [
      "Handle inquiries via chat, email, text and calls",
      "Automated follow-ups for abandoned bookings",
      "24/7 availability for global customers",
      "Seamless handoff to human agents when needed",
    ],
    example:
      "A travel agency implemented our communication bot, resulting in a 45% increase in booking completions and 30% reduction in response time.",
    industries: ["Travel", "Tourism", "Hospitality", "Event Planning"],
    link: "/CAPTIVITE-X/features/travel-bot",
  },
  {
    id: "billing-assistant",
    title: "Billing Assistant",
    description:
      "Secure AI assistant for answering specific billing questions after authentication",
    icon: "CreditCard",
    benefits: [
      "Secure authentication before accessing billing data",
      "Instant answers to common billing questions",
      "Integration with existing billing software",
      "Reduced call center volume for billing inquiries",
    ],
    example:
      "A healthcare provider deployed our billing assistant, reducing billing-related calls by 55% while maintaining HIPAA compliance.",
    industries: ["Healthcare", "Insurance", "Financial Services", "Utilities"],
    link: "/CAPTIVITE-X/features/billing-assistant",
  },
  {
    id: "legal-assistant",
    title: "Legal Assistant",
    description:
      "AI-powered assistant for legal document review, case research, and client intake",
    icon: "Shield",
    benefits: [
      "Automated legal document analysis",
      "Case law research assistance",
      "Client intake automation",
      "Secure and compliant communication",
    ],
    example:
      "A law firm implemented our legal assistant for client intake, reducing initial consultation time by 40% and improving case preparation efficiency.",
    industries: ["Legal", "Compliance", "Corporate", "Government"],
    link: "/CAPTIVITE-X/features/legal-assistant",
  },
  {
    id: "education-bot",
    title: "Education Assistant",
    description:
      "AI tutor and administrative support for educational institutions",
    icon: "Brain",
    benefits: [
      "24/7 student support for common questions",
      "Course material assistance and tutoring",
      "Administrative inquiry handling",
      "Enrollment and registration support",
    ],
    example:
      "A university deployed our education assistant to handle student inquiries, resulting in 85% faster response times and allowing staff to focus on complex issues.",
    industries: ["Education", "E-Learning", "Training", "Academic Research"],
    link: "/CAPTIVITE-X/features/education-assistant",
  },
  {
    id: "product-advisor",
    title: "Product Advisor",
    description:
      "AI-powered product recommendation and configuration assistant",
    icon: "Lightbulb",
    benefits: [
      "Personalized product recommendations",
      "Complex product configuration assistance",
      "Feature comparison and explanation",
      "Technical specification guidance",
    ],
    example:
      "An electronics retailer implemented our product advisor, increasing conversion rates by 35% and reducing returns by helping customers find the right products.",
    industries: ["Retail", "E-commerce", "Manufacturing", "Technology"],
    link: "/CAPTIVITE-X/features/product-advisor",
  },
  {
    id: "marketing-assistant",
    title: "Marketing Assistant",
    description:
      "AI-powered content creation, campaign management, and analytics",
    icon: "Megaphone",
    benefits: [
      "Automated content generation and optimization",
      "Campaign performance analysis",
      "Audience segmentation recommendations",
      "Competitive marketing intelligence",
    ],
    example:
      "A digital marketing agency used our marketing assistant to optimize campaigns, resulting in 28% higher engagement rates and 15% lower cost per acquisition.",
    industries: ["Marketing", "Advertising", "Media", "Public Relations"],
    link: "/CAPTIVITE-X/features/marketing-assistant",
  },
];

// Industry-specific use cases
export const industryUseCases: IndustryUseCase[] = [
  {
    id: "healthcare",
    industry: "Healthcare",
    description: "Streamline patient communication and appointment management",
    icon: "Stethoscope",
    useCases: [
      "Patient appointment scheduling and reminders",
      "Medical billing inquiry assistance",
      "Post-visit follow-up automation",
      "Prescription refill requests",
    ],
    link: "/CAPTIVITE-X/solutions/healthcare",
  },
  {
    id: "real-estate",
    industry: "Real Estate",
    description:
      "Automate property inquiries and streamline client communication",
    icon: "Building2",
    useCases: [
      "Property listing inquiries and scheduling",
      "Tenant maintenance request management",
      "Automated follow-up with potential buyers",
      "Rental application processing",
    ],
    link: "/CAPTIVITE-X/solutions/real-estate",
  },
  {
    id: "hospitality",
    industry: "Hospitality",
    description: "Enhance guest experience with AI-powered communication",
    icon: "UtensilsCrossed",
    useCases: [
      "Reservation management and confirmations",
      "Guest service requests and concierge",
      "Post-stay feedback collection",
      "Loyalty program engagement",
    ],
    link: "/CAPTIVITE-X/solutions/hospitality",
  },
  {
    id: "professional-services",
    industry: "Professional Services",
    description: "Optimize client engagement and streamline operations",
    icon: "Briefcase",
    useCases: [
      "Client consultation scheduling",
      "Document collection automation",
      "Service inquiry handling",
      "Client onboarding and follow-up",
    ],
    link: "/CAPTIVITE-X/solutions/professional-services",
  },
  {
    id: "retail",
    industry: "Retail",
    description: "Enhance customer experience and drive sales",
    icon: "Store",
    useCases: [
      "Product inquiry and availability checks",
      "Order status updates and tracking",
      "Return and exchange processing",
      "Personalized product recommendations",
    ],
    link: "/CAPTIVITE-X/solutions/retail",
  },
  {
    id: "education",
    industry: "Education",
    description: "Improve student engagement and administrative efficiency",
    icon: "School",
    useCases: [
      "Enrollment and admissions support",
      "Course registration assistance",
      "Student service inquiries",
      "Alumni engagement and fundraising",
    ],
    link: "/CAPTIVITE-X/solutions/education",
  },
  {
    id: "legal",
    industry: "Legal",
    description: "Streamline client intake and case management",
    icon: "Gavel",
    useCases: [
      "Initial client screening and intake",
      "Document collection automation",
      "Case status updates for clients",
      "Appointment scheduling and reminders",
    ],
    link: "/CAPTIVITE-X/solutions/legal",
  },
  {
    id: "financial",
    industry: "Financial Services",
    description: "Enhance client service and compliance",
    icon: "Landmark",
    useCases: [
      "Account inquiry handling",
      "Secure authentication for billing questions",
      "Loan application status updates",
      "Financial product information",
    ],
    link: "/CAPTIVITE-X/solutions/financial",
  },
  {
    id: "travel",
    industry: "Travel & Tourism",
    description: "Optimize booking processes and customer service",
    icon: "Plane",
    useCases: [
      "Booking inquiries and reservations",
      "Itinerary management and updates",
      "Travel documentation assistance",
      "Destination information and recommendations",
    ],
    link: "/CAPTIVITE-X/solutions/travel",
  },
  {
    id: "automotive",
    industry: "Automotive",
    description: "Streamline sales and service operations",
    icon: "Car",
    useCases: [
      "Vehicle inquiry and availability checks",
      "Service appointment scheduling",
      "Maintenance reminder automation",
      "Parts ordering and status updates",
    ],
    link: "/CAPTIVITE-X/solutions/automotive",
  },
  {
    id: "logistics",
    industry: "Logistics & Transportation",
    description: "Enhance tracking and customer communication",
    icon: "Truck",
    useCases: [
      "Shipment tracking and updates",
      "Delivery scheduling and coordination",
      "Service area and availability checks",
      "Quote requests and processing",
    ],
    link: "/CAPTIVITE-X/solutions/logistics",
  },
  {
    id: "agriculture",
    industry: "Agriculture",
    description: "Optimize operations and customer engagement",
    icon: "Leaf",
    useCases: [
      "Product availability and ordering",
      "Weather and harvest planning assistance",
      "Equipment maintenance scheduling",
      "Supplier communication automation",
    ],
    link: "/CAPTIVITE-X/solutions/agriculture",
  },
  {
    id: "construction",
    industry: "Construction",
    description: "Improve project management and client communication",
    icon: "Hammer",
    useCases: [
      "Project inquiry and quote requests",
      "Subcontractor scheduling and coordination",
      "Material ordering and tracking",
      "Client update automation",
    ],
    link: "/CAPTIVITE-X/solutions/construction",
  },
  {
    id: "home-services",
    industry: "Home Services",
    description: "Streamline scheduling and customer management",
    icon: "Wrench",
    useCases: [
      "Service appointment scheduling",
      "Quote requests and processing",
      "Follow-up and maintenance reminders",
      "Emergency service coordination",
    ],
    link: "/CAPTIVITE-X/solutions/home-services",
  },
  {
    id: "fashion",
    industry: "Fashion & Apparel",
    description: "Enhance customer experience and sales",
    icon: "Shirt",
    useCases: [
      "Product inquiry and availability",
      "Size and fit recommendations",
      "Order status and tracking",
      "Style consultation scheduling",
    ],
    link: "/CAPTIVITE-X/solutions/fashion",
  },
  {
    id: "beauty",
    industry: "Beauty & Wellness",
    description: "Optimize appointment booking and client retention",
    icon: "Scissors",
    useCases: [
      "Appointment scheduling and reminders",
      "Service inquiry handling",
      "Product recommendations",
      "Client follow-up and retention",
    ],
    link: "/CAPTIVITE-X/solutions/beauty",
  },
  {
    id: "entertainment",
    industry: "Entertainment",
    description: "Enhance ticket sales and customer engagement",
    icon: "Headphones",
    useCases: [
      "Ticket sales and availability checks",
      "Event information and updates",
      "Membership and subscription management",
      "Fan engagement and promotions",
    ],
    link: "/CAPTIVITE-X/solutions/entertainment",
  },
  {
    id: "technology",
    industry: "Technology",
    description: "Streamline support and enhance user experience",
    icon: "Laptop",
    useCases: [
      "Technical support automation",
      "Product documentation assistance",
      "Installation and troubleshooting guidance",
      "Feature inquiry handling",
    ],
    link: "/CAPTIVITE-X/solutions/technology",
  },
  {
    id: "telecommunications",
    industry: "Telecommunications",
    description: "Improve customer service and technical support",
    icon: "Smartphone",
    useCases: [
      "Plan and service inquiries",
      "Technical troubleshooting assistance",
      "Billing question handling",
      "Upgrade and renewal management",
    ],
    link: "/CAPTIVITE-X/solutions/telecommunications",
  },
];

// API endpoints
export const getFeatures = () => {
  return features;
};

export const getFeatureById = (id: string) => {
  return features.find((feature) => feature.id === id);
};

export const getSpecializedSolutions = () => {
  return specializedSolutions;
};

export const getSolutionById = (id: string) => {
  return specializedSolutions.find((solution) => solution.id === id);
};

export const getIndustryUseCases = () => {
  return industryUseCases;
};

export const getIndustryById = (id: string) => {
  return industryUseCases.find((industry) => industry.id === id);
};

export const getFeaturesByIndustry = (industryId: string) => {
  const industry = getIndustryById(industryId);
  if (!industry) return [];

  // Logic to match features to industry needs
  return features.filter((feature) => {
    // This would be more sophisticated in a real implementation
    return Math.random() > 0.5; // Randomly select features for demo purposes
  });
};

export const getSolutionsByIndustry = (industryId: string) => {
  const industry = getIndustryById(industryId);
  if (!industry) return [];

  // Logic to match solutions to industry needs
  return specializedSolutions.filter((solution) => {
    return solution.industries.some(
      (ind) => ind.toLowerCase() === industry.industry.toLowerCase(),
    );
  });
};
