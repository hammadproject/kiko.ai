import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  HeartPulse,
  House,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveformField } from "@/components/waveform-mark";

interface ServiceTeam {
  title: string;
  description: string;
  icon: LucideIcon;
}

const serviceTeams: ServiceTeam[] = [
  {
    title: "Home services",
    description: "Turn urgent questions into scheduled visits.",
    icon: House,
  },
  {
    title: "Health & wellness",
    description: "Help callers find and book the right appointment.",
    icon: HeartPulse,
  },
  {
    title: "Property teams",
    description: "Qualify interest and keep viewings moving.",
    icon: Building2,
  },
  {
    title: "Professional services",
    description: "Capture intent and route every enquiry clearly.",
    icon: BriefcaseBusiness,
  },
];

const capabilities = ["Answers", "Qualifies", "Schedules", "Escalates"];

export function ServiceTeamsSection() {
  return (
    <section id="service-teams" className="section-space relative overflow-hidden border-t border-border/60">
      <WaveformField className="pointer-events-none absolute left-[-70px] top-[108px] hidden scale-125 opacity-80 lg:flex" />
      <WaveformField className="pointer-events-none absolute right-[-70px] top-[108px] hidden scale-x-[-1] scale-y-125 opacity-80 lg:flex" />

      <div className="site-container relative">
        <div className="mx-auto max-w-[1100px] text-center">
          <p className="eyebrow">Built for service teams</p>
          <h2 className="section-title mt-6">Every call has a next step.</h2>
          <p className="section-intro mx-auto mt-5 max-w-[760px]">kiko.ai adapts to the conversations that keep appointment-led businesses moving.</p>
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border border-foreground/70 bg-card">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4">
            {serviceTeams.map((team) => {
              const Icon = team.icon;
              return (
                <article key={team.title} className="service-team-card px-7 py-9 sm:min-h-[280px] sm:px-9 sm:py-10">
                  <span className="service-icon-circle grid size-20 place-items-center rounded-full text-foreground" aria-hidden="true">
                    <Icon size={36} strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">{team.title}</h3>
                  <p className="mt-3 text-base leading-7 text-muted sm:text-[17px]">{team.description}</p>
                </article>
              );
            })}
          </div>

          <div className="capability-strip grid grid-cols-2 border-t border-border sm:grid-cols-4">
            {capabilities.map((capability) => (
              <div key={capability} className="capability-item flex min-h-16 items-center justify-center gap-3 px-3 py-3 font-semibold">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-signal" aria-hidden="true"><Check size={16} strokeWidth={3} /></span>
                {capability}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="min-h-14 max-w-full px-7 text-base">
            <a href="#contact">See what kiko.ai could handle for your team <ArrowRight size={20} aria-hidden="true" /></a>
          </Button>
        </div>
      </div>
    </section>
  );
}
