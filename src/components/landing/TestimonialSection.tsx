import React from "react";
import { Card } from "@/components/ui/card";
import LazyImage from "@/components/ui/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
}

interface TestimonialSectionProps {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Operations Director",
    company: "TechCorp Inc.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    quote:
      "Captivite has transformed how we handle customer interactions. The AI automation is simply outstanding.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "CTO",
    company: "InnovateTech",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    quote:
      "The ROI we've seen since implementing Captivite has been incredible. Our response times are down 85%.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Customer Success Manager",
    company: "ServicePro",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop",
    quote:
      "Our customer satisfaction scores have increased by 40% since using Captivite's automation tools.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Head of Support",
    company: "TechSolutions Ltd",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    quote:
      "The AI-powered responses are incredibly accurate and have helped us scale our support operations.",
    rating: 4,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Marketing Director",
    company: "GrowthCo",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
    quote:
      "Captivite's analytics have given us invaluable insights into our customer engagement.",
    rating: 5,
  },
  {
    id: 6,
    name: "James Wilson",
    role: "CEO",
    company: "StartupX",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    quote:
      "This platform has been a game-changer for our business growth and customer relationships.",
    rating: 5,
  },
  {
    id: 7,
    name: "Anna Martinez",
    role: "Product Manager",
    company: "SaaS Solutions",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    quote:
      "The integration capabilities are fantastic. Works seamlessly with all our existing tools.",
    rating: 4,
  },
  {
    id: 8,
    name: "Robert Chang",
    role: "IT Director",
    company: "DataFlow Inc",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    quote:
      "Implementation was smooth and the support team was incredibly helpful throughout.",
    rating: 5,
  },
  {
    id: 9,
    name: "Sophie Anderson",
    role: "Operations Manager",
    company: "RetailPro",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    quote:
      "Our team loves how intuitive and user-friendly the platform is. Great experience!",
    rating: 5,
  },
  {
    id: 10,
    name: "Marcus Johnson",
    role: "Sales Director",
    company: "GrowthForce",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop",
    quote:
      "The automated follow-ups have significantly improved our conversion rates.",
    rating: 5,
  },
  {
    id: 11,
    name: "Rachel Lee",
    role: "Customer Experience Lead",
    company: "ServiceHub",
    avatar:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop",
    quote:
      "Captivite has helped us maintain high service quality even during peak hours.",
    rating: 4,
  },
  {
    id: 12,
    name: "Thomas Brown",
    role: "Tech Lead",
    company: "CloudTech",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    quote:
      "The API integration was straightforward and the documentation is excellent.",
    rating: 5,
  },
  {
    id: 13,
    name: "Maria Garcia",
    role: "Support Manager",
    company: "HelpDesk Pro",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop",
    quote:
      "We've reduced our response time by 75% while maintaining high quality support.",
    rating: 5,
  },
  {
    id: 14,
    name: "Alex Turner",
    role: "Digital Transformation Lead",
    company: "InnovateNow",
    avatar:
      "https://images.unsplash.com/photo-1520409364224-63400afe26e5?w=150&h=150&fit=crop",
    quote:
      "Captivite's AI capabilities have exceeded our expectations in every way.",
    rating: 5,
  },
  {
    id: 15,
    name: "Jennifer Wu",
    role: "Business Analyst",
    company: "AnalyticsPro",
    avatar:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&h=150&fit=crop",
    quote:
      "The insights we get from the analytics dashboard are incredibly valuable.",
    rating: 4,
  },
  {
    id: 16,
    name: "Chris O'Connor",
    role: "Support Team Lead",
    company: "TechAssist",
    avatar:
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&h=150&fit=crop",
    quote:
      "Our team's productivity has increased significantly since implementing Captivite.",
    rating: 5,
  },
  {
    id: 17,
    name: "Samantha Lee",
    role: "Operations Specialist",
    company: "OptimizeNow",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
    quote:
      "The automation workflows have streamlined our entire customer service process.",
    rating: 5,
  },
  {
    id: 18,
    name: "Daniel Smith",
    role: "IT Manager",
    company: "TechFlow Solutions",
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop",
    quote: "Excellent platform with robust features and reliable performance.",
    rating: 5,
  },
];

const TestimonialSection = ({
  testimonials = defaultTestimonials,
}: TestimonialSectionProps) => {
  return (
    <section className="w-full py-16 relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/5 to-secondary/10 animate-gradient-slow">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.2, 0.3, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover how Captivite is transforming businesses through
            intelligent automation
          </motion.p>
        </div>

        <Carousel
          className="w-full max-w-5xl mx-auto"
          opts={{
            loop: true,
            align: "start",
            dragFree: true,
            containScroll: "trimSnaps",
          }}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={testimonial.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border border-primary/10 hover:scale-105 hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                          <LazyImage
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            fallback={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`}
                            className="w-full h-full object-cover"
                          />
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {testimonial.role} at {testimonial.company}
                          </p>
                        </div>
                      </div>

                      <div className="flex mb-4">
                        {Array.from({ length: testimonial.rating }).map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 text-yellow-400 fill-current"
                            />
                          ),
                        )}
                      </div>

                      <div className="flex-grow">
                        <Quote className="w-8 h-8 text-primary/20 mb-2" />
                        <p className="text-gray-600 italic">
                          {testimonial.quote}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;
