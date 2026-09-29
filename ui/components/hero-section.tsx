"use client";

import { AudioLines } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoCallPlayer } from "@/components/demo-call-player";
import { HeroWaveformBackdrop } from "@/components/waveform-mark";

export function HeroSection() {
  function startDemo() {
    document.querySelector("#demo-call")?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => window.dispatchEvent(new Event("kiko:play-demo")), 450);
  }

  return (
    <section id="home" className="relative overflow-hidden pb-16 pt-8 sm:pt-12 lg:pb-20">
      <HeroWaveformBackdrop className="pointer-events-none absolute inset-x-0 top-[135px] hidden h-[250px] opacity-75 md:flex" />

      <div className="site-container relative">
        <div className="mx-auto max-w-5xl text-center">
          <p className="hero-eyebrow">AI Receptionist <span>•</span> Call Answering <span>•</span> Appointment Booking <span>•</span> Support</p>
          <h1 className="display-title mx-auto mt-5 max-w-[980px]">Conversations handled.<br />Business moving.</h1>
          <p className="mx-auto mt-5 max-w-[660px] text-balance text-lg leading-7 text-muted sm:text-xl">
            A natural AI receptionist that answers every call, books appointments, and keeps your business available.
          </p>
          <Button variant="signal" className="mt-7 min-h-14 px-8 text-base" onClick={startDemo}>
            Hear kiko.ai in action <AudioLines size={19} aria-hidden="true" />
          </Button>
        </div>

        <DemoCallPlayer />
      </div>
    </section>
  );
}
