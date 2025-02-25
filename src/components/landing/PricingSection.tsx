import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import ROICalculator from "./ROICalculator";

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

interface PricingTier {
  name: string;
  basePrice: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: string[];
  includedServices: string[];
}

interface PricingSectionProps {
  pricingTiers?: PricingTier[];
  onPlanSelect?: (plan: string) => void;
}

const services: Service[] = [
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
];

const defaultPricingTiers: PricingTier[] = [
  {
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
  },
  {
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
  },
  {
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
  },
];

const PricingSection = ({
  pricingTiers = defaultPricingTiers,
  onPlanSelect = () => {},
}: PricingSectionProps) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 mb-4">
            Choose the plan that's right for your business
          </p>
          <p className="text-green-600 font-semibold mb-8">
            45-Day Money-Back Guarantee on All Plans
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className={`text-sm ${!isYearly ? "text-primary" : "text-gray-500"}`}
            >
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span
              className={`text-sm ${isYearly ? "text-primary" : "text-gray-500"}`}
            >
              Yearly (20% off)
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <Card
              key={tier.name}
              className="p-6 bg-white relative hover:shadow-xl transition-shadow"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${isYearly ? tier.basePrice.yearly : tier.basePrice.monthly}
                  </span>
                  <span className="text-gray-500">/month</span>
                  {isYearly && (
                    <div className="text-sm text-green-600 mt-1">
                      Save 20% with annual billing
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={index === 1 ? "default" : "outline"}
                onClick={() => onPlanSelect(tier.name)}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">
            Calculate Your ROI
          </h3>
          <div className="flex justify-center">
            <ROICalculator />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
