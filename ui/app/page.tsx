import { BenefitsSection } from "@/components/benefits-section";
import { ConsultationSection } from "@/components/consultation-section";
import { HeroSection } from "@/components/hero-section";
import { OpportunityCalculator } from "@/components/opportunity-calculator";
import { ServiceTeamsSection } from "@/components/service-teams-section";
import { SiteHeader } from "@/components/site-header";
import { WaveformMark } from "@/components/waveform-mark";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <BenefitsSection />
        <ServiceTeamsSection />
        <OpportunityCalculator />
        <ConsultationSection />
      </main>
      <footer className="border-t border-border py-10">
        <div className="site-container flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <a href="#home" className="flex items-center gap-2 text-xl font-bold tracking-[-0.04em]" aria-label="kiko.ai home"><WaveformMark className="h-8 scale-50" />kiko.ai</a>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium">
              <li><a className="nav-link" href="#home">Home</a></li>
              <li><a className="nav-link" href="#services">Services</a></li>
              <li><a className="nav-link" href="#about">About</a></li>
              <li><a className="nav-link" href="#contact">Contact</a></li>
            </ul>
          </nav>
          <p className="text-sm text-muted">© {new Date().getFullYear()} kiko.ai</p>
        </div>
      </footer>
    </>
  );
}
