import { useState } from 'react';
import Loader from './components/Loader';
import GrainOverlay from './components/GrainOverlay';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import Footer from './components/Footer';
import InquiryModal from './components/InquiryModal';

export default function App() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <Loader />
      <GrainOverlay />
      <CustomCursor />
      <Header />

      <main className="relative">
        <HeroSection onOpenInquiry={() => setInquiryOpen(true)} />
        <MarqueeSection />
        <AboutSection onOpenInquiry={() => setInquiryOpen(true)} />
        <ServicesSection />
        <ProjectsSection />
        <Footer />
      </main>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}
