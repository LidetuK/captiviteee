import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, Rocket, Shield, Clock, Gift } from "lucide-react";

const GetStarted = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
            Start Your AI Automation Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your business in minutes with our powerful automation
            platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold">Quick Setup</h3>
              <ul className="space-y-3">
                {[
                  "15-minute onboarding call",
                  "Same-day implementation",
                  "Dedicated support specialist",
                  "Custom configuration",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold">Risk-Free Trial</h3>
              <ul className="space-y-3">
                {[
                  "45-day money-back guarantee",
                  "No long-term contracts",
                  "Cancel anytime",
                  "Full feature access",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Getting Started Is Easy</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Book a Demo",
                description: "Schedule a personalized demo with our team",
              },
              {
                step: 2,
                title: "Quick Setup",
                description: "We'll configure everything for your business",
              },
              {
                step: 3,
                title: "Go Live",
                description: "Start automating and growing your business",
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8 bg-primary text-primary-foreground">
            <CardContent className="space-y-6">
              <Gift className="h-12 w-12 mx-auto" />
              <h3 className="text-2xl font-bold">Special Launch Offer</h3>
              <p className="text-lg opacity-90">
                Get 20% off your first 3 months when you start today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Schedule Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm opacity-80">
                <Clock className="h-4 w-4" />
                <span>Limited time offer</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
