import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
            Ready to Transform Your Business Operations?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of businesses saving 20+ hours per week with
            Captivite's AI-powered automation platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
              asChild
            >
              <Link to="/CAPTIVITE-X/get-started">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              asChild
            >
              <Link to="/CAPTIVITE-X/dashboard">
                <Calendar className="mr-2 h-4 w-4" /> Schedule Demo
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>
              Set up in minutes • No credit card required • 14-day free trial
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
