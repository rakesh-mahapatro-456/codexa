import React from 'react'
import { useRouter } from 'next/router'
import { NavbarLanding } from '@/components/custom/NavbarLanding'
import { Hero } from '@/components/custom/landing/Hero'
import { Feature } from '@/components/custom/landing/Feature'
import { HowItWorks } from '@/components/custom/landing/HowItWorks'
import { LiveDemoShowcase } from '@/components/custom/landing/LiveDemoShowcase'
import { CTASection } from '@/components/custom/landing/CTASection'
import { Footer } from '@/components/custom/landing/Footer'

export default function LandingPage() {
  const router = useRouter();

  const handleSignupClick = () => {
    router.push('/signup');
  };

  return (
    <div>
      <NavbarLanding />
      <Hero />
      <Feature />
      <HowItWorks />
      <LiveDemoShowcase />
      <CTASection/>
      <Footer/>
    </div>
  );
}
