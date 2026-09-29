"use client";

import { useMemo, useState } from "react";
import { WaveformField } from "@/components/waveform-mark";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface ControlRowProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function ControlRow({ id, label, value, min, max, step, prefix = "", suffix = "", onChange }: ControlRowProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <label htmlFor={`${id}-number`} className="font-semibold">{label}</label>
      <div className="mt-4 flex items-center gap-5">
        <input
          id={`${id}-range`}
          className="calculator-range min-w-0 flex-1"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(clamp(event.currentTarget.valueAsNumber, min, max))}
          aria-label={label}
          aria-valuetext={`${prefix}${value.toLocaleString()}${suffix}`}
          style={{ "--range-progress": `${percentage}%` } as React.CSSProperties}
        />
        <div className="relative w-[116px] shrink-0">
          {prefix && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">{prefix}</span>}
          <input
            id={`${id}-number`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(clamp(event.currentTarget.valueAsNumber, min, max))}
            className={`h-14 w-full rounded-[9px] border border-foreground/70 bg-white text-lg tabular-nums outline-none focus:ring-2 focus:ring-signal-strong ${prefix ? "pl-8 pr-4" : "px-4"}`}
            aria-describedby={`${id}-hint`}
          />
          {suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg">{suffix}</span>}
        </div>
      </div>
      <span id={`${id}-hint`} className="sr-only">Minimum {prefix}{min}{suffix}; maximum {prefix}{max.toLocaleString()}{suffix}.</span>
    </div>
  );
}

export function OpportunityCalculator() {
  const [missedCalls, setMissedCalls] = useState(8);
  const [bookingValue, setBookingValue] = useState(180);
  const [bookingRate, setBookingRate] = useState(35);

  const result = useMemo(() => {
    const weekly = missedCalls * bookingValue * (bookingRate / 100);
    return { monthly: weekly * 52 / 12, annual: weekly * 52 };
  }, [missedCalls, bookingRate, bookingValue]);

  return (
    <section id="about" className="section-space border-t border-border/60">
      <div className="site-container grid items-center gap-14 lg:grid-cols-[0.92fr_1.18fr] lg:gap-20">
        <div>
          <p className="eyebrow">The cost of a missed call</p>
          <h2 className="section-title mt-7">Put a number on the calls you can’t answer.</h2>
          <p className="section-intro mt-6 max-w-[600px]">Use your own numbers to estimate the booking value that may be slipping through during busy hours and after closing.</p>
          <WaveformField className="mt-14 hidden h-28 origin-left scale-125 md:flex" />
        </div>

        <div>
          <div className="rounded-xl border border-foreground/70 bg-card p-5 sm:p-8">
            <div className="space-y-8">
              <ControlRow id="missed-calls" label="Missed calls each week" value={missedCalls} min={0} max={100} step={1} onChange={setMissedCalls} />
              <ControlRow id="booking-value" label="Average booking value" value={bookingValue} min={0} max={5000} step={10} prefix="$" onChange={setBookingValue} />
              <ControlRow id="booking-rate" label="Calls that typically book" value={bookingRate} min={0} max={100} step={1} suffix="%" onChange={setBookingRate} />
            </div>

            <div className="mt-8 rounded-[11px] bg-dark-panel px-6 py-7 text-white sm:px-8" aria-live="polite">
              <p className="eyebrow text-white/65">Estimated opportunity value</p>
              <p className="mt-4 text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-none tracking-[-0.05em]"><span className="text-signal">{currency.format(result.monthly)}</span> <span className="whitespace-nowrap">/ month</span></p>
              <p className="mt-3 text-[clamp(1.55rem,3vw,2.2rem)] font-bold tracking-[-0.035em]">{currency.format(result.annual)} / year</p>
              <p className="mt-3 text-sm leading-6 text-white/70">Based on {missedCalls} missed calls per week and a {bookingRate}% booking rate.</p>

              <div className="mt-7 flex h-[82px] items-end gap-2 border-b border-white/25" aria-hidden="true">
                {Array.from({ length: 12 }, (_, index) => (
                  <span key={index} className="flex-1 rounded-t-[3px] bg-gradient-to-t from-signal/25 to-signal" style={{ height: `${18 + index * 6.5}%` }} />
                ))}
              </div>
              <div className="mt-2 grid grid-cols-12 gap-2 text-center text-[10px] text-white/60 sm:text-xs" aria-hidden="true">
                {['J','F','M','A','M','J','J','A','S','O','N','D'].map((month, index) => <span key={`${month}-${index}`}>{month}</span>)}
              </div>
              <span className="sr-only">The chart projects the cumulative opportunity value over twelve months.</span>
            </div>

          </div>
          <p className="mt-3 text-center text-xs leading-5 text-muted">Illustrative estimate based on the values above. Actual results vary.</p>
        </div>
      </div>
    </section>
  );
}
