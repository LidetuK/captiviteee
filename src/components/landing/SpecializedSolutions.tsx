import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Search,
  Phone,
  CreditCard,
  Bot,
  Shield,
  Brain,
  Lightbulb,
  Megaphone,
} from "lucide-react";

const SpecializedSolutions = () => {
  const solutions = [
    {
      id: "tech-support",
      title: "Tech Support AI",
      description:
        "AI trained on your documentation to handle installations, troubleshooting and inquiries",
      icon: <FileText className="h-12 w-12 text-primary" />,
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
      icon: <Search className="h-12 w-12 text-primary" />,
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
      icon: <Phone className="h-12 w-12 text-primary" />,
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
      icon: <CreditCard className="h-12 w-12 text-primary" />,
      benefits: [
        "Secure authentication before accessing billing data",
        "Instant answers to common billing questions",
        "Integration with existing billing software",
        "Reduced call center volume for billing inquiries",
      ],
      example:
        "A healthcare provider deployed our billing assistant, reducing billing-related calls by 55% while maintaining HIPAA compliance.",
      industries: [
        "Healthcare",
        "Insurance",
        "Financial Services",
        "Utilities",
      ],
      link: "/CAPTIVITE-X/features/billing-assistant",
    },
    {
      id: "legal-assistant",
      title: "Legal Assistant",
      description:
        "AI-powered assistant for legal document review, case research, and client intake",
      icon: <Shield className="h-12 w-12 text-primary" />,
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
      icon: <Brain className="h-12 w-12 text-primary" />,
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
      icon: <Lightbulb className="h-12 w-12 text-primary" />,
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
      icon: <Megaphone className="h-12 w-12 text-primary" />,
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

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
            Specialized AI Solutions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our purpose-built AI solutions for specific business needs
          </p>
        </div>

        <Tabs defaultValue="tech-support" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 bg-muted p-1 rounded-lg overflow-x-auto">
            {solutions.map((solution) => (
              <TabsTrigger
                key={solution.id}
                value={solution.id}
                className="flex items-center gap-2 py-2 px-3 whitespace-nowrap"
              >
                {solution.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {solutions.map((solution) => (
            <TabsContent key={solution.id} value={solution.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          {solution.icon}
                          <h3 className="text-2xl font-semibold">
                            {solution.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-6">
                          {solution.description}
                        </p>
                        <div className="space-y-4">
                          <h4 className="font-medium">Key Benefits</h4>
                          <ul className="space-y-3">
                            {solution.benefits.map((benefit, index) => (
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
                          <div className="mt-6">
                            <h4 className="font-medium mb-2">Ideal For</h4>
                            <div className="flex flex-wrap gap-2">
                              {solution.industries.map((industry, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                >
                                  {industry}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button asChild className="mt-6">
                            <Link to={solution.link}>
                              Learn more <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-lg border border-border/50">
                        <h4 className="font-medium mb-4">Success Story</h4>
                        <p className="italic text-muted-foreground mb-6">
                          "{solution.example}"
                        </p>
                        <div className="aspect-video relative overflow-hidden rounded-lg shadow-lg mt-4">
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">
                              Solution Preview
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-8 text-center">
          <Button asChild>
            <Link to="/CAPTIVITE-X/solutions">
              View All Solutions <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SpecializedSolutions;
