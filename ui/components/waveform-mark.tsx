import { cn } from "@/lib/utils";

const bars = [10, 22, 34, 48, 32, 20, 11];

export function WaveformMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex h-12 items-center gap-[3px]", className)} aria-hidden="true">
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="w-[4px] rounded-full bg-current"
          style={{ height }}
        />
      ))}
    </span>
  );
}

export function WaveformField({ className }: { className?: string }) {
  const heights = [18, 34, 48, 64, 42, 28, 18, 12, 8, 5, 9, 14, 11, 7, 4, 7, 11, 8, 5, 3];
  return (
    <div className={cn("flex items-center gap-[9px] text-border", className)} aria-hidden="true">
      {heights.map((height, index) => (
        <span
          key={index}
          className={cn("w-px bg-current", index >= 3 && index <= 5 && "text-signal-strong")}
          style={{ height }}
        />
      ))}
    </div>
  );
}

export function HeroWaveformBackdrop({ className }: { className?: string }) {
  const bars = Array.from({ length: 72 }, (_, index) => {
    const distanceToPulse = Math.min(Math.abs(index - 10), Math.abs(index - 61));
    const pulse = Math.max(0, 1 - distanceToPulse / 8) * 88;
    const texture = 8 + Math.abs(Math.sin(index * 0.72)) * 24;
    return Math.round(texture + pulse);
  });

  return (
    <div className={cn("flex items-center justify-between gap-2 text-border", className)} aria-hidden="true">
      {bars.map((height, index) => {
        const highlighted = Math.abs(index - 10) <= 1 || Math.abs(index - 61) <= 1;
        return (
          <span
            key={index}
            className={cn("w-px shrink-0 bg-current", highlighted && "text-signal-strong")}
            style={{ height }}
          />
        );
      })}
    </div>
  );
}
