// src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";

// Section Imports
import Hero from "../sections/Hero"; // Section 1 [cite: 5]
import SocialProof from "../sections/SocialProof"; // Section 2 [cite: 13]
import CoreProblem from "../sections/CoreProblem"; // Section 3 [cite: 17]
import WhatIsLeadMates from "../sections/WhatIsLeadMates"; // Section 4 [cite: 24]
import WhyLeadMates from "../sections/WhyLeadMates"; // Section 5 [cite: 30]
import HowItWorks from "../sections/HowItWorks"; // Section 6 [cite: 35]
import BuiltFor from "../sections/BuiltFor"; // Section 7 [cite: 41]
import PracticalBenefits from "../sections/PracticalBenefits"; // Section 8 [cite: 45]
import CoreFeatures from "../sections/CoreFeatures"; // Section 9 [cite: 48]
import Comparison from "../sections/Comparison"; // Section 10 
import RealWorldFeedback from "../sections/RealWorldFeedback"; // Section 11 [cite: 55]
import PricingPhilosophy from "../sections/PricingPhilosophy"; // Section 12 
import FAQ from "../sections/FAQ"; // Section 13 [cite: 63]
import FinalCTA from "../sections/FinalCTA"; // Section 14 [cite: 71]

// Component Imports
import AnimatedSection from "../components/AnimatedSection";
import GalaxyHero from "../components/GalaxyHero"; 
import Contact from "./Contact";

export default function Home() {
  return (
    <main className="relative bg-[#0B0D10] min-h-screen overflow-x-hidden">
      
      {/* 1. BACKGROUND LAYER: Fixed 3D Galaxy background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GalaxyHero />
      </div>

      {/* 2. CONTENT LAYER: Using perspective for the holographic feel */}
      <div className="relative z-10 perspective-[1500px]">
        
        {/* SECTION 1: HERO - A Reliable System to Turn Website Traffic into Qualified Leads [cite: 7] */}
        <Hero />

        {/* SECTION 2: TRUST STRIP - Used internally by TechMates [cite: 15] */}
        <SocialProof />

        {/* SECTION 3: CORE PROBLEM - Why Most Websites Fail to Convert [cite: 19] */}
        <AnimatedSection>
          <CoreProblem />
        </AnimatedSection>

        {/* SECTION 4: WHAT LEADMATES IS - A conversion infrastructure [cite: 27] */}
        <AnimatedSection>
          <WhatIsLeadMates />
        </AnimatedSection>

        {/* SECTION 5: WHY LEADMATES - Built for real businesses, removes guesswork [cite: 32, 33] */}
        <AnimatedSection>
          <WhyLeadMates />
        </AnimatedSection>

        {/* SECTION 6: HOW IT WORKS - Step 1 through Step 4 [cite: 37, 38, 39] */}
        <AnimatedSection>
          <HowItWorks />
        </AnimatedSection>

        {/* SECTION 7: BUILT FOR / NOT BUILT FOR [cite: 41] */}
        <AnimatedSection>
          <BuiltFor />
        </AnimatedSection>

        {/* SECTION 8: BUSINESS BENEFITS - Faster launches, predictable flow [cite: 45, 47] */}
        <AnimatedSection>
          <PracticalBenefits />
        </AnimatedSection>

        {/* SECTION 9: CORE FEATURES - Conversion-first architecture [cite: 48, 50] */}
        <AnimatedSection>
          <CoreFeatures />
        </AnimatedSection>

        {/* SECTION 10: COMPARISON - Traditional Websites vs LeadMates [cite: 51, 52] */}
        <AnimatedSection>
          <Comparison />
        </AnimatedSection>

        {/* SECTION 11: REAL-WORLD FEEDBACK [cite: 55] */}
        <AnimatedSection>
          <RealWorldFeedback />
        </AnimatedSection>

        {/* SECTION 12: PRICING PHILOSOPHY - One-time purchase, lifetime usage [cite: 59, 61] */}
        <AnimatedSection>
          <PricingPhilosophy />
        </AnimatedSection>

        {/* SECTION 13: FAQ [cite: 63] */}
        <AnimatedSection>
          <FAQ />
        </AnimatedSection>

        {/* SECTION 14: CONTACT */}
        <AnimatedSection>
          <Contact />
        </AnimatedSection>

        {/* SECTION 15: FINAL CTA - If lead generation matters, get access [cite: 71, 73, 74] */}
        <AnimatedSection delay={0.2}>
          <FinalCTA />
        </AnimatedSection>
      </div>
    </main>
  );
}