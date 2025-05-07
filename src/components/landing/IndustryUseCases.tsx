import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Stethoscope,
  UtensilsCrossed,
  Briefcase,
  Store,
  School,
  Gavel,
  Landmark,
  Plane,
  Car,
  Truck,
  Leaf,
  Hammer,
  Wrench,
  Shirt,
  Scissors,
  Headphones,
  Laptop,
  Smartphone,
} from "lucide-react";

interface IndustryUseCase {
  industry: string;
  description: string;
  icon: React.ReactNode;
  useCases: string[];
  link: string;
}

const IndustryUseCases = () => {
  const industries: IndustryUseCase[] = [
    {
      industry: "Healthcare",
      description:
        "Streamline patient communication and appointment management",
      icon: <Stethoscope className="h-10 w-10 text-primary" />,
      useCases: [
        "Patient appointment scheduling and reminders",
        "Medical billing inquiry assistance",
        "Post-visit follow-up automation",
        "Prescription refill requests",
      ],
      link: "/CAPTIVITE-X/solutions/healthcare",
    },
    {
      industry: "Real Estate",
      description:
        "Automate property inquiries and streamline client communication",
      icon: <Building2 className="h-10 w-10 text-primary" />,
      useCases: [
        "Property listing inquiries and scheduling",
        "Tenant maintenance request management",
        "Automated follow-up with potential buyers",
        "Rental application processing",
      ],
      link: "/CAPTIVITE-X/solutions/real-estate",
    },
    {
      industry: "Hospitality",
      description: "Enhance guest experience with AI-powered communication",
      icon: <UtensilsCrossed className="h-10 w-10 text-primary" />,
      useCases: [
        "Reservation management and confirmations",
        "Guest service requests and concierge",
        "Post-stay feedback collection",
        "Loyalty program engagement",
      ],
      link: "/CAPTIVITE-X/solutions/hospitality",
    },
    {
      industry: "Professional Services",
      description: "Optimize client engagement and streamline operations",
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      useCases: [
        "Client consultation scheduling",
        "Document collection automation",
        "Service inquiry handling",
        "Client onboarding and follow-up",
      ],
      link: "/CAPTIVITE-X/solutions/professional-services",
    },
    {
      industry: "Retail",
      description: "Enhance customer experience and drive sales",
      icon: <Store className="h-10 w-10 text-primary" />,
      useCases: [
        "Product inquiry and availability checks",
        "Order status updates and tracking",
        "Return and exchange processing",
        "Personalized product recommendations",
      ],
      link: "/CAPTIVITE-X/solutions/retail",
    },
    {
      industry: "Education",
      description: "Improve student engagement and administrative efficiency",
      icon: <School className="h-10 w-10 text-primary" />,
      useCases: [
        "Enrollment and admissions support",
        "Course registration assistance",
        "Student service inquiries",
        "Alumni engagement and fundraising",
      ],
      link: "/CAPTIVITE-X/solutions/education",
    },
    {
      industry: "Legal",
      description: "Streamline client intake and case management",
      icon: <Gavel className="h-10 w-10 text-primary" />,
      useCases: [
        "Initial client screening and intake",
        "Document collection automation",
        "Case status updates for clients",
        "Appointment scheduling and reminders",
      ],
      link: "/CAPTIVITE-X/solutions/legal",
    },
    {
      industry: "Financial Services",
      description: "Enhance client service and compliance",
      icon: <Landmark className="h-10 w-10 text-primary" />,
      useCases: [
        "Account inquiry handling",
        "Secure authentication for billing questions",
        "Loan application status updates",
        "Financial product information",
      ],
      link: "/CAPTIVITE-X/solutions/financial",
    },
    {
      industry: "Travel & Tourism",
      description: "Optimize booking processes and customer service",
      icon: <Plane className="h-10 w-10 text-primary" />,
      useCases: [
        "Booking inquiries and reservations",
        "Itinerary management and updates",
        "Travel documentation assistance",
        "Destination information and recommendations",
      ],
      link: "/CAPTIVITE-X/solutions/travel",
    },
    {
      industry: "Automotive",
      description: "Streamline sales and service operations",
      icon: <Car className="h-10 w-10 text-primary" />,
      useCases: [
        "Vehicle inquiry and availability checks",
        "Service appointment scheduling",
        "Maintenance reminder automation",
        "Parts ordering and status updates",
      ],
      link: "/CAPTIVITE-X/solutions/automotive",
    },
    {
      industry: "Logistics & Transportation",
      description: "Enhance tracking and customer communication",
      icon: <Truck className="h-10 w-10 text-primary" />,
      useCases: [
        "Shipment tracking and updates",
        "Delivery scheduling and coordination",
        "Service area and availability checks",
        "Quote requests and processing",
      ],
      link: "/CAPTIVITE-X/solutions/logistics",
    },
    {
      industry: "Agriculture",
      description: "Optimize operations and customer engagement",
      icon: <Leaf className="h-10 w-10 text-primary" />,
      useCases: [
        "Product availability and ordering",
        "Weather and harvest planning assistance",
        "Equipment maintenance scheduling",
        "Supplier communication automation",
      ],
      link: "/CAPTIVITE-X/solutions/agriculture",
    },
    {
      industry: "Construction",
      description: "Improve project management and client communication",
      icon: <Hammer className="h-10 w-10 text-primary" />,
      useCases: [
        "Project inquiry and quote requests",
        "Subcontractor scheduling and coordination",
        "Material ordering and tracking",
        "Client update automation",
      ],
      link: "/CAPTIVITE-X/solutions/construction",
    },
    {
      industry: "Home Services",
      description: "Streamline scheduling and customer management",
      icon: <Wrench className="h-10 w-10 text-primary" />,
      useCases: [
        "Service appointment scheduling",
        "Quote requests and processing",
        "Follow-up and maintenance reminders",
        "Emergency service coordination",
      ],
      link: "/CAPTIVITE-X/solutions/home-services",
    },
    {
      industry: "Fashion & Apparel",
      description: "Enhance customer experience and sales",
      icon: <Shirt className="h-10 w-10 text-primary" />,
      useCases: [
        "Product inquiry and availability",
        "Size and fit recommendations",
        "Order status and tracking",
        "Style consultation scheduling",
      ],
      link: "/CAPTIVITE-X/solutions/fashion",
    },
    {
      industry: "Beauty & Wellness",
      description: "Optimize appointment booking and client retention",
      icon: <Scissors className="h-10 w-10 text-primary" />,
      useCases: [
        "Appointment scheduling and reminders",
        "Service inquiry handling",
        "Product recommendations",
        "Client follow-up and retention",
      ],
      link: "/CAPTIVITE-X/solutions/beauty",
    },
    {
      industry: "Entertainment",
      description: "Enhance ticket sales and customer engagement",
      icon: <Headphones className="h-10 w-10 text-primary" />,
      useCases: [
        "Ticket sales and availability checks",
        "Event information and updates",
        "Membership and subscription management",
        "Fan engagement and promotions",
      ],
      link: "/CAPTIVITE-X/solutions/entertainment",
    },
    {
      industry: "Technology",
      description: "Streamline support and enhance user experience",
      icon: <Laptop className="h-10 w-10 text-primary" />,
      useCases: [
        "Technical support automation",
        "Product documentation assistance",
        "Installation and troubleshooting guidance",
        "Feature inquiry handling",
      ],
      link: "/CAPTIVITE-X/solutions/technology",
    },
    {
      industry: "Telecommunications",
      description: "Improve customer service and technical support",
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      useCases: [
        "Plan and service inquiries",
        "Technical troubleshooting assistance",
        "Billing question handling",
        "Upgrade and renewal management",
      ],
      link: "/CAPTIVITE-X/solutions/telecommunications",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
            Industry-Specific Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how Captivite can be tailored to meet the unique needs of
            your industry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow border border-border/50"
            >
              <div className="mb-4">{industry.icon}</div>
              <h3 className="text-xl font-semibold mb-2">
                {industry.industry}
              </h3>
              <p className="text-muted-foreground mb-4">
                {industry.description}
              </p>
              <ul className="mb-4 space-y-2">
                {industry.useCases.map((useCase, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <span className="text-sm">{useCase}</span>
                  </li>
                ))}
              </ul>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link
                  to={industry.link}
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
            <Link to="/CAPTIVITE-X/solutions">
              Explore All Industries <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default IndustryUseCases;
