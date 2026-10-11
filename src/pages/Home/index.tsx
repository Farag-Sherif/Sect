import Layout from '../../components/layout/Layout';
import Hero from '../../components/hero/Hero';
import RecommendedProducts from '../../components/products/RecommendedProducts';
import Bestsellers from '../../components/products/Bestsellers';
import OccasionsSection from '../../components/occasions/OccasionsSection';
import TestimonialsSection from '../../components/testimonials/TestimonialsSection';
import Newsletter from '../../components/newsletter/Newsletter';
import FadeIn from '../../components/ui/FadeIn';

export default function Home() {
  return (
    <Layout>
      {/* The Cinematic Hero now contains Intro, Features, Story, and Categories */}
      <Hero />
      
      {/* Continuing with standard E-commerce sections below the cinematic experience */}
      <div className="bg-[#fdfbf9] relative z-20 overflow-x-hidden w-full">
        <FadeIn delay={0.1} direction="up">
          <RecommendedProducts />
        </FadeIn>
        <FadeIn delay={0.1} direction="up">
          <Bestsellers />
        </FadeIn>
        <FadeIn delay={0.1} direction="up">
          <OccasionsSection />
        </FadeIn>
        <FadeIn delay={0.1} direction="up">
          <TestimonialsSection />
        </FadeIn>
        <FadeIn delay={0.1} direction="up">
          <Newsletter />
        </FadeIn>
      </div>
    </Layout>
  );
}
