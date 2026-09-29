"use client";

import { useEffect, useMemo, useRef } from "react";
import { UserRound } from "lucide-react";
import { WaveformMark } from "@/components/waveform-mark";
import { cn } from "@/lib/utils";
import type { TranscriptMessage } from "@/src/data/transcript";

interface TranscriptFeedProps {
  messages: TranscriptMessage[];
  currentTime: number;
  hasStarted: boolean;
  followSignal: number;
}

function formatTimestamp(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function TranscriptFeed({ messages, currentTime, hasStarted, followSignal }: TranscriptFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const autoFollowRef = useRef(true);
  const programmaticScrollRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visible = useMemo(
    () => (hasStarted ? messages.filter((message) => message.start <= currentTime + 0.04) : []),
    [currentTime, hasStarted, messages],
  );
  const activeId = messages.find(
    (message) => currentTime >= message.start && currentTime < message.end,
  )?.id;

  useEffect(() => {
    autoFollowRef.current = true;
  }, [followSignal]);

  useEffect(() => {
    const container = containerRef.current;
    const active = activeRef.current;
    if (!container || !active || !autoFollowRef.current) return;

    programmaticScrollRef.current = true;
    const target = Math.max(0, active.offsetTop - container.clientHeight / 2 + active.clientHeight / 2);
    container.scrollTo({ top: target, behavior: "smooth" });
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 450);
  }, [activeId, visible.length]);

  useEffect(() => () => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
  }, []);

  function handleScroll() {
    const container = containerRef.current;
    if (!container || programmaticScrollRef.current) return;
    const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 56;
    autoFollowRef.current = nearBottom;
  }

  return (
    <div
      ref={containerRef}
      className="transcript-scroll relative h-[340px] overflow-y-auto bg-card px-5 py-6 sm:px-8"
      onScroll={handleScroll}
      onWheel={() => { autoFollowRef.current = false; }}
      onTouchStart={() => { autoFollowRef.current = false; }}
      aria-label="Call transcript"
      aria-live="polite"
    >
      {!hasStarted && (
        <div className="grid h-full place-items-center text-center">
          <div>
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-dark-panel text-white"><WaveformMark className="h-7 scale-50" /></span>
            <p className="mt-4 font-semibold">Your demo call is ready</p>
            <p className="mt-1 text-sm text-muted">Press play to follow the conversation in real time.</p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {visible.map((message) => {
          const assistant = message.speaker === "assistant";
          const active = message.id === activeId;
          return (
            <div
              key={message.id}
              ref={active ? activeRef : undefined}
              className={cn("message-reveal flex gap-3", !assistant && "flex-row-reverse")}
            >
              <span className={cn("mt-5 grid size-11 shrink-0 place-items-center rounded-full bg-dark-panel text-white", active && "ring-2 ring-signal ring-offset-2 ring-offset-card")} aria-hidden="true">
                {assistant ? <WaveformMark className="h-6 scale-[0.42]" /> : <UserRound size={21} />}
              </span>
              <div className={cn("max-w-[78%]", !assistant && "text-right")}>
                <div className={cn("mb-1.5 flex items-center gap-3 text-xs", !assistant && "justify-end")}>
                  <strong className="text-[13px] text-foreground">{assistant ? "Mia — kiko.ai" : "Customer"}</strong>
                  <time className="text-muted">{formatTimestamp(message.start)}</time>
                </div>
                <p className={cn("rounded-xl border px-4 py-3 text-left text-sm leading-6 sm:text-[15px]", assistant ? "border-transparent bg-[#f0f0ec]" : "border-border bg-white", active && "border-signal-strong")}>
                  {message.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
