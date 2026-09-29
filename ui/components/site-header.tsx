"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveformMark } from "@/components/waveform-mark";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30 border-b border-transparent">
      <div className="site-container flex h-[84px] items-center justify-between">
        <a href="#home" className="flex items-center gap-3 text-2xl font-bold tracking-[-0.04em]" aria-label="kiko.ai home">
          <WaveformMark className="h-9 scale-75" />
          <span>kiko.ai</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-12 text-sm font-medium">
            {links.map((link) => (
              <li key={link.href}>
                <a className="nav-link" href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <Button asChild variant="outline" className="hidden md:inline-flex">
          <a href="#contact">Book a Consultation</a>
        </Button>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-[10px] border border-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute inset-x-4 top-[76px] rounded-xl border border-border bg-card p-3 shadow-lg md:hidden">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a className="block rounded-lg px-4 py-3 font-medium hover:bg-black/5" href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-2 w-full">
            <a href="#contact" onClick={() => setOpen(false)}>Book a Consultation</a>
          </Button>
        </nav>
      )}
    </header>
  );
}
