import React from "react";
import ConsultationDialog from "./consultation/ConsultationDialog";
import { motion } from "framer-motion";
import Navbar from "./landing/Navbar";
import HeroSection from "./landing/HeroSection";
import Features from "./landing/Features";
import TestimonialSection from "./landing/TestimonialSection";
import PricingSection from "./landing/PricingSection";
import ChatWidget from "./landing/ChatWidget";
import Footer from "./landing/Footer";
import FAQ from "./landing/FAQ";
import AnalyticsDashboard from "./landing/AnalyticsDashboard";
import IntegrationHub from "./landing/IntegrationHub";
import Blog from "./landing/Blog";

const Home = () => {
  const [showDemo, setShowDemo] = React.useState(false);
  const [showConsultation, setShowConsultation] = React.useState(false);

  const handleDemoRequest = () => {
    setShowDemo(true);
  };

  const handleConsultation = () => {
    setShowConsultation(true);
  };

  const handlePlanSelect = (plan: string) => {
    // In a real app, this would start the signup process
    console.log("Selected plan:", plan);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onDemoClick={handleDemoRequest}
        onConsultationClick={handleConsultation}
      />

      <main className="overflow-hidden">
        <HeroSection
          onDemoClick={handleDemoRequest}
          onConsultationClick={handleConsultation}
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Features />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <TestimonialSection />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <PricingSection onPlanSelect={handlePlanSelect} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <AnalyticsDashboard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <IntegrationHub />
        </motion.div>
        <Blog />
        <FAQ />
      </main>

      <ChatWidget />

      {/* Consultation Dialog */}
      <ConsultationDialog
        open={showConsultation}
        onOpenChange={setShowConsultation}
      />
    </div>
  );
};

export default Home;
