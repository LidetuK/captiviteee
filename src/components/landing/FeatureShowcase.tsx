import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, BarChart3, MessageSquare, Boxes } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}

interface FeatureShowcaseProps {
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    title: "Engagement",
    description:
      "Enhance customer interactions with AI-powered communication tools",
    icon: <MessageSquare className="w-6 h-6" />,
    benefits: [
      "Smart response suggestions",
      "Automated follow-ups",
      "Multi-channel support",
      "Sentiment analysis",
    ],
  },
  {
    title: "Scheduling",
    description: "Streamline your calendar management and booking process",
    icon: <Calendar className="w-6 h-6" />,
    benefits: [
      "Automated scheduling",
      "Smart availability management",
      "Meeting preferences learning",
      "Calendar optimization",
    ],
  },
  {
    title: "Analytics",
    description: "Gain valuable insights from your business data",
    icon: <BarChart3 className="w-6 h-6" />,
    benefits: [
      "Real-time dashboards",
      "Predictive analytics",
      "Custom reporting",
      "Performance tracking",
    ],
  },
  {
    title: "Integration",
    description: "Seamlessly connect with your existing tools and workflows",
    icon: <Boxes className="w-6 h-6" />,
    benefits: [
      "API connectivity",
      "Third-party integrations",
      "Custom workflows",
      "Data synchronization",
    ],
  },
];

const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  features = defaultFeatures,
}) => {
  const [activeTab, setActiveTab] = useState(features[0].title.toLowerCase());

  return (
    <div className="w-full max-w-[1200px] mx-auto p-6 bg-gradient-to-br from-accent via-background to-secondary/5">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover how our AI-powered platform can transform your business
          operations
        </p>
      </div>

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-muted p-1 rounded-lg">
          {features.map((feature) => (
            <TabsTrigger
              key={feature.title.toLowerCase()}
              value={feature.title.toLowerCase()}
              className="flex items-center gap-2 py-3"
            >
              {feature.icon}
              <span className="hidden md:inline">{feature.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {features.map((feature) => (
          <TabsContent
            key={feature.title.toLowerCase()}
            value={feature.title.toLowerCase()}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        {feature.icon}
                        <h3 className="text-2xl font-semibold">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        {feature.description}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Key Benefits</h4>
                      <ul className="space-y-3">
                        {feature.benefits.map((benefit, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            {benefit}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FeatureShowcase;
