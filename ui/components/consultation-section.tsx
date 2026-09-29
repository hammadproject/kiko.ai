import { Check } from "lucide-react";
import { ConsultationForm } from "@/components/consultation-form";
import { WaveformMark } from "@/components/waveform-mark";

const details = [
  "30-minute discovery call",
  "Built around your current workflow",
  "No commitment required",
];

export function ConsultationSection() {
  return (
    <section id="contact" className="section-space border-t border-border/60 scroll-mt-4">
      <div className="site-container overflow-hidden rounded-xl border border-foreground/70 bg-card">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="px-6 py-12 sm:px-10 lg:px-12 lg:py-16 xl:px-14">
            <div className="flex items-center gap-5">
              <WaveformMark className="h-10 scale-75" />
              <p className="eyebrow">Let’s talk</p>
            </div>
            <h2 className="section-title mt-8 max-w-[650px]">Give your callers a better first hello.</h2>
            <p className="section-intro mt-6 max-w-[620px]">Tell us how your team handles calls today. We’ll show you where kiko.ai can step in and what a practical rollout could look like.</p>
            <ul className="mt-10 space-y-5">
              {details.map((detail) => (
                <li key={detail} className="flex items-center gap-4 text-base font-semibold sm:text-lg">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-signal"><Check size={19} strokeWidth={2.5} aria-hidden="true" /></span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border px-6 py-12 sm:px-10 lg:border-l lg:border-t-0 lg:px-12 lg:py-16 xl:px-14">
            <h3 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.045em]">Book a consultation</h3>
            <p className="mt-3 text-lg leading-7 text-muted">Share a few details and choose a time that works for you.</p>
            <div className="mt-8"><ConsultationForm /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
