import { ArrowRight, Check, UserRound } from "lucide-react";
import { WaveformMark } from "@/components/waveform-mark";

const benefits = [
  {
    title: "Available when you aren’t",
    description: "Answers customers during busy hours, after closing, and whenever your team needs backup.",
    visual: (
      <div className="flex h-28 items-center gap-5" aria-hidden="true">
        <span className="size-5 rounded-full bg-signal-strong" />
        <span className="text-[74px] font-bold leading-none tracking-[-0.07em]">24 / 7</span>
      </div>
    ),
  },
  {
    title: "Turns calls into bookings",
    description: "Checks availability, gathers the right details, and confirms the next step while the caller is still on the line.",
    visual: (
      <div className="flex h-28 items-center" aria-hidden="true">
        <div className="flex w-full max-w-[330px] items-center gap-2.5 sm:gap-4 rounded-[10px] border border-foreground/60 px-3 py-2.5 sm:px-4 sm:py-3">
          <span className="whitespace-nowrap text-base sm:text-lg">10:00 AM</span>
          <span className="h-8 w-px shrink-0 bg-border" />
          <span className="ml-auto rounded-lg bg-signal/40 px-2.5 py-1.5 text-xs font-semibold sm:px-3 sm:py-2 sm:text-sm">Confirmed</span>
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-signal-strong sm:size-8"><Check className="size-4 sm:size-[18px]" strokeWidth={3} /></span>
        </div>
      </div>
    ),
  },
  {
    title: "Brings in a person when needed",
    description: "Routes unusual or sensitive conversations to your team with the context intact.",
    visual: (
      <div className="flex h-28 items-center gap-5" aria-hidden="true">
        <span className="grid size-[76px] place-items-center rounded-2xl border border-border bg-white"><WaveformMark className="scale-[0.72]" /></span>
        <ArrowRight size={34} strokeWidth={1.5} />
        <span className="grid size-[82px] place-items-center rounded-full border border-signal-strong bg-signal/15"><span className="grid size-14 place-items-center rounded-full bg-foreground text-white"><UserRound size={29} /></span></span>
      </div>
    ),
  },
];

export function BenefitsSection() {
  return (
    <section id="services" className="section-space border-t border-border/60">
      <div className="site-container">
        <div className="max-w-[920px]">
          <p className="eyebrow">Why kiko.ai</p>
          <h2 className="section-title mt-7">Less call handling.<br />More business moving.</h2>
          <p className="section-intro mt-5 max-w-[760px]">kiko.ai takes care of routine calls—from first question to confirmed appointment—so your team can stay focused.</p>
        </div>

        <div className="mt-14 grid overflow-hidden rounded-xl border border-foreground/70 bg-card lg:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="benefit-card px-7 py-9 sm:px-10 lg:min-h-[390px] lg:px-11 lg:py-11">
              {benefit.visual}
              <h3 className="mt-8 text-2xl font-semibold tracking-[-0.035em]">{benefit.title}</h3>
              <p className="mt-4 text-[17px] leading-7 text-muted">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
