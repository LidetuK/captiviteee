import React, { useState } from "react";
import HeroSection from "./landing/HeroSection";
import FeatureShowcase from "./landing/FeatureShowcase";
import Features from "./landing/Features";
import TestimonialSection from "./landing/TestimonialSection";
import PricingSection from "./landing/PricingSection";
import ChatWidget from "./landing/ChatWidget";
import ConsultationDialog from "./consultation/ConsultationDialog";
import Footer from "./landing/Footer";
import Navbar from "./landing/Navbar";
import Blog from "./landing/Blog";
import FAQ from "./landing/FAQ";
import GetStarted from "./landing/GetStarted";
import IntegrationHub from "./landing/IntegrationHub";
import TrustSection from "./landing/TrustSection";
import CTASection from "./landing/CTASection";
import IndustryUseCases from "./landing/IndustryUseCases";
import SpecializedSolutions from "./landing/SpecializedSolutions";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showConsultation, setShowConsultation] = useState(false);
  const navigate = useNavigate();

  const handleDemoClick = () => {
    navigate("/get-started");
  };

  const handleConsultationClick = () => {
    setShowConsultation(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onDemoClick={handleDemoClick} onConsultationClick={handleConsultationClick} />
      <HeroSection
        onDemoClick={handleDemoClick}
        onConsultationClick={handleConsultationClick}
      />
      <Features />
      <FeatureShowcase />
      <SpecializedSolutions />
      <IndustryUseCases />
      <IntegrationHub />
      <TrustSection />
      <TestimonialSection />
      <PricingSection />
      <CTASection />
      <Blog />
      <FAQ />
      <GetStarted />
      <Footer />
      <ChatWidget />
      <ConsultationDialog
        open={showConsultation}
        onOpenChange={setShowConsultation}
      />
    </div>
  );
};

export default Home;
