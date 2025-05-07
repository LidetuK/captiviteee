import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageSquare,
  Calendar,
  Star,
  BarChart3,
  Bot,
  Boxes,
  FileText,
  Search,
  Phone,
  CreditCard,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Text-Back AI",
      description:
        "24/7 automated customer response system that handles inquiries instantly",
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      link: "/CAPTIVITE-X/features/text-back",
    },
    {
      title: "Smart Scheduling",
      description:
        "AI-powered appointment management that eliminates double-bookings",
      icon: <Calendar className="h-10 w-10 text-primary" />,
      link: "/CAPTIVITE-X/features/scheduling",
    },
    {
      title: "Reputation Management",
      description:
        "Monitor and improve your online presence with automated review responses",
      icon: <Star className="h-10 w-10 text-primary" />,
      link: "/CAPTIVITE-X/features/reputation",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Real-time business insights that help you make data-driven decisions",
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      link: "/CAPTIVITE-X/features/analytics",
    },
    {
      title: "AI Assistant",
      description:
        "Virtual assistant that handles tasks and provides intelligent support",
      icon: <Bot className="h-10 w-10 text-primary" />,
      link: "/CAPTIVITE-X/features/ai-assistant",
    },
    {
      title: "Integration Hub",
      description:
        "Connect with your favorite tools like Salesforce, HubSpot, and more",
      icon: <Boxes className="h-10 w-10 text-primary" />,
      link: "/CAPTIVITE-X/features/integrations",
    },
    {
      title: "Tech Support AI",
      description:
        "AI trained on your documentation to handle installations, troubleshooting and inquiries",
      icon: <FileText className="h-10 w-10 text-primary" />,
      link: "/CAPTIVITE-X/features/tech-support",
    },
    {
      title: "Research & Lead Gen",
      description:
        "AI-powered research and lead generation for specific domains, tags or niches",
      icon: <Search className="h-10 w-10 text-primary" />,
      link: "/CAPTIVITE-X/features/research",
    },
    {
      title: "Travel Agency Bot",
      description:
        "Multi-channel communication bot for travel inquiries with automated follow-ups",
      icon: <Phone className="h-10 w-10 text-primary" />,
      link: "/CAPTIVITE-X/features/travel-bot",
    },
    {
      title: "Billing Assistant",
      description:
        "Secure AI assistant for answering specific billing questions after authentication",
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      link: "/CAPTIVITE-X/features/billing-assistant",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
            Powerful Features for Your Business
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to automate, optimize, and grow your business
            operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow border border-border/50"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">
                {feature.description}
              </p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link
                  to={feature.link}
                  className="flex items-center text-primary"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white"
            asChild
          >
            <Link to="/CAPTIVITE-X/features">
              Explore All Features <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
