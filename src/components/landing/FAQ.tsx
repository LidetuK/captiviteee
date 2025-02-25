import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What services are included in the Single Service plan?",
    answer:
      "You can choose any one of our core services: Text-Back AI, Reputation Management, or Smart Scheduling. Each service comes with full features and our 45-day money-back guarantee.",
  },
  {
    question: "Can I switch or add services later?",
    answer:
      "Yes! You can switch services or add additional ones at any time. The Business Bundle allows you to use any three services, and you can change your selection monthly.",
  },
  {
    question: "How does the 45-day money-back guarantee work?",
    answer:
      "If you're not completely satisfied with our service within the first 45 days, we'll provide a full refund - no questions asked. We want you to be confident in your investment.",
  },
  {
    question: "Do you offer custom solutions for specific industries?",
    answer:
      "Yes, our Enterprise plan includes custom solutions tailored to your industry's specific needs. We have experience in healthcare, hospitality, retail, and professional services.",
  },
  {
    question: "What kind of support is included?",
    answer:
      "All plans include basic support. The Business Bundle includes priority support with faster response times, while Enterprise plans get 24/7 dedicated support and monthly strategy sessions.",
  },
  {
    question: "How long does it take to set up?",
    answer:
      "Most services can be set up within 24-48 hours. For Enterprise solutions with custom integrations, our team will provide a detailed timeline based on your requirements.",
  },
  {
    question: "Can I integrate with my existing tools?",
    answer:
      "Yes, we offer integration with popular CRM systems, calendar apps, and communication tools. Enterprise plans include custom integration development.",
  },
  {
    question: "What's the typical ROI timeline?",
    answer:
      "Most clients see positive ROI within 2-3 months. Our ROI calculator can provide estimates based on your specific business metrics.",
  },
];

const FAQ = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-background via-accent/10 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our services and pricing
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
