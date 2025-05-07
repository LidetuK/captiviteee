import React from "react";
import { Shield, Lock, CheckCircle } from "lucide-react";

const TrustSection = () => {
  const securityBadges = [
    "/assets/security/soc2.svg",
    "/assets/security/gdpr.svg",
    "/assets/security/hipaa.svg",
    "/assets/security/ssl.svg",
  ];

  const trustPoints = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Enterprise-Grade Security",
      description:
        "Your data is protected with bank-level encryption and security protocols",
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: "Privacy Guaranteed",
      description:
        "We never sell your data and maintain strict privacy controls",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "99.9% Uptime SLA",
      description:
        "Rely on our platform with confidence thanks to our guaranteed uptime",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Trusted by Businesses Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Security and reliability you can count on for your critical business
            operations
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
          {securityBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 bg-background rounded-lg shadow-sm border border-border/50 h-20 w-32"
            >
              {/* Fallback for missing security badge images */}
              <div className="text-muted-foreground text-xs text-center">
                {index === 0 && "SOC 2"}
                {index === 1 && "GDPR Compliant"}
                {index === 2 && "HIPAA Compliant"}
                {index === 3 && "256-bit SSL"}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border border-border/50"
            >
              <div className="mb-4 p-3 bg-primary/10 rounded-full">
                {point.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
              <p className="text-muted-foreground">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
