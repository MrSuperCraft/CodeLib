// pages/index.tsx
import Header from '@/components/Header';
import HeroSection from '@/components/Hero';
import FeaturesSection from '@/components/Features';
import AboutSection from '@/components/About';
import TestimonialsSection from '@/components/Testimonials';
import CallToActionSection from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CallToActionSection />
      <Footer />
    </>
  );
};

export default Home;
