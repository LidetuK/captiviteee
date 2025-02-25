import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import TypewriterText from "./TypewriterText";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  onDemoClick?: () => void;
  onConsultationClick?: () => void;
}

const HeroSection = ({
  title = "Transform Your Business with AI-Powered Automation",
  subtitle = "Streamline operations, boost productivity, and drive growth with our intelligent automation platform",
  onDemoClick = () => {},
  onConsultationClick = () => {},
}: HeroSectionProps) => {
  return (
    <div className="relative w-full min-h-[800px] bg-gradient-to-br from-primary/20 via-background to-secondary/20 overflow-hidden before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNNDAgMzBoNHY0aC00ek0zMiAzMmg0djRoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] before:opacity-20">
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

      {/* Content */}
      <div className="relative container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[800px] text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary max-w-4xl animate-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <TypewriterText
            baseText="Let us"
            words={[
              "Transform",
              "Elevate",
              "Boost",
              "Upgrade",
              "Enhance",
              "Optimize",
              "Revolutionize",
              "Accelerate",
            ]}
            className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary"
          />{" "}
          Your Business with AI-Powered Automation
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            size="lg"
            onClick={onDemoClick}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onConsultationClick}
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Request Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Optional: Add floating elements or additional visual elements */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1.5 h-8 rounded-full bg-primary/30 backdrop-blur-sm" />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
