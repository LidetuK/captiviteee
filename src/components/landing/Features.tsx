import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Star,
  Calendar,
  Bot,
  LineChart,
  Zap,
  Building2,
  Shield,
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  useCase?: string;
}

export const features: Feature[] = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Text-Back AI",
    description:
      "Intelligent automated response system that handles customer inquiries 24/7",
    benefits: [
      "Reduce response time by 95%",
      "Handle multiple conversations simultaneously",
      "Personalized responses based on customer history",
      "Seamless handoff to human agents",
    ],
    useCase:
      "A local restaurant reduced their response time from 30 minutes to under 1 minute, leading to 40% more reservations",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Reputation Management",
    description:
      "Comprehensive monitoring and management of your online presence",
    benefits: [
      "Monitor reviews across all platforms",
      "Automated response suggestions",
      "Sentiment analysis and trends",
      "Competitive benchmarking",
    ],
    useCase:
      "A healthcare provider improved their rating from 3.8 to 4.7 stars in just 3 months",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Smart Scheduling",
    description: "AI-powered appointment management system",
    benefits: [
      "Reduce no-shows by 80%",
      "Automated reminders and follow-ups",
      "Intelligent conflict resolution",
      "Multi-location support",
    ],
    useCase:
      "A salon chain reduced no-shows by 75% and increased bookings by 35%",
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: "AI Assistant",
    description: "Virtual assistant that handles common tasks and inquiries",
    benefits: [
      "24/7 customer support",
      "Multi-language support",
      "Task automation",
      "Learning capabilities",
    ],
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: "Analytics Dashboard",
    description: "Comprehensive insights into your business performance",
    benefits: [
      "Real-time metrics",
      "Custom reports",
      "Trend analysis",
      "ROI tracking",
    ],
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Automation Engine",
    description: "Powerful workflow automation for repetitive tasks",
    benefits: [
      "Custom workflow builder",
      "Integration capabilities",
      "Error handling",
      "Performance monitoring",
    ],
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Enterprise Solutions",
    description: "Customized solutions for large organizations",
    benefits: [
      "Custom development",
      "Advanced security",
      "Dedicated support",
      "Training programs",
    ],
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Security & Compliance",
    description: "Enterprise-grade security and compliance features",
    benefits: [
      "Data encryption",
      "Role-based access",
      "Audit trails",
      "Compliance reporting",
    ],
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions to transform your business operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                {feature.useCase && (
                  <div className="mt-4 p-3 bg-accent/30 rounded-lg text-sm">
                    <strong>Case Study:</strong> {feature.useCase}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
