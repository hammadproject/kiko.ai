"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { TranscriptFeed } from "@/components/transcript-feed";
import { voiceDemos } from "@/src/data/transcript";
import { cn } from "@/lib/utils";

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function DemoCallPlayer() {
  const [activeDemoId, setActiveDemoId] = useState(voiceDemos[0].id);
  const activeDemo = voiceDemos.find((d) => d.id === activeDemoId) || voiceDemos[0];

  const audioRef = useRef<HTMLAudioElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(activeDemo.transcriptData.durationSeconds);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [followSignal, setFollowSignal] = useState(0);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.ended) audio.currentTime = 0;
    setEnded(false);
    setHasStarted(true);
    setFollowSignal((value) => value + 1);
    try {
      await audio.play();
    } catch {
      playButtonRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    const handleHeroPlay = () => void play();
    window.addEventListener("kiko:play-demo", handleHeroPlay);
    return () => window.removeEventListener("kiko:play-demo", handleHeroPlay);
  }, [play]);

  // Removed useEffect for demo change reset to avoid cascading renders

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause(); else void play();
  }

  function restart() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    setHasStarted(true);
    setEnded(false);
    setFollowSignal((value) => value + 1);
    void audio.play().catch(() => playButtonRef.current?.focus());
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
    setHasStarted(true);
    setEnded(value >= duration);
    setFollowSignal((signal) => signal + 1);
  }

  return (
    <div id="demo-call" className="mx-auto mt-12 max-w-[1160px] scroll-mt-6">
      <div className="mx-auto mb-6 flex w-fit rounded-full border border-border bg-white p-1 shadow-sm">
        {voiceDemos.map((demo) => (
          <button
            key={demo.id}
            onClick={() => {
              if (activeDemoId !== demo.id) {
                setActiveDemoId(demo.id);
                const audio = audioRef.current;
                if (audio) {
                  audio.pause();
                  audio.currentTime = 0;
                  audio.load();
                }
                setCurrentTime(0);
                setDuration(demo.transcriptData.durationSeconds);
                setPlaying(false);
                setHasStarted(false);
                setEnded(false);
                setFollowSignal((prev) => prev + 1);
              }
            }}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2",
              activeDemoId === demo.id
                ? "bg-signal text-foreground shadow-sm"
                : "text-muted hover:text-foreground hover:bg-black/5"
            )}
          >
            {demo.category}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-[14px] border border-black bg-dark-panel shadow-[0_18px_50px_rgba(17,19,16,0.08)]">
        <audio
          ref={audioRef}
          preload="metadata"
          src={`/demo/${activeDemo.transcriptData.audioFile}`}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onPlay={() => {
            setPlaying(true);
            setHasStarted(true);
          }}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onPause={(event) => {
            setPlaying(false);
            setCurrentTime(event.currentTarget.currentTime);
          }}
          onEnded={() => {
            setPlaying(false);
            setEnded(true);
            setCurrentTime(duration);
          }}
        />

        <div className="flex flex-col border-b border-white/10 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-0 sm:min-h-[58px]">
          <div className="flex items-center gap-3">
            <span className="size-3 rounded-full bg-signal shrink-0" aria-hidden="true" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-semibold text-sm sm:text-base">{activeDemo.company}</span>
              <span className="hidden text-white/40 sm:inline">—</span>
              <span className="text-xs text-white/70 sm:text-sm">{activeDemo.scenario}</span>
            </div>
          </div>
          <span className="mt-2 font-mono text-sm tabular-nums text-white/70 sm:mt-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-4 px-5 py-4 text-white sm:gap-6 sm:px-7">
          <button
            ref={playButtonRef}
            type="button"
            onClick={togglePlayback}
            className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-signal text-white transition hover:bg-signal hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-dark-panel sm:size-14"
            aria-label={playing ? "Pause demo call" : ended ? "Replay demo call" : "Play demo call"}
          >
            {playing ? <Pause size={21} fill="currentColor" /> : <Play className="ml-0.5" size={21} fill="currentColor" />}
          </button>
          <div className="min-w-0 flex-1">
            <input
              className="audio-range"
              type="range"
              min={0}
              max={duration || 1}
              step="0.01"
              value={Math.min(currentTime, duration)}
              onChange={(event) => seek(Number(event.target.value))}
              aria-label="Seek demo call"
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              style={{ "--range-progress": `${duration ? (currentTime / duration) * 100 : 0}%` } as React.CSSProperties}
            />
            <div className="mt-1 flex justify-between font-mono text-xs text-white/70"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
          </div>
          <button
            type="button"
            onClick={restart}
            className="grid size-11 shrink-0 place-items-center rounded-[10px] border border-white/30 transition hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            aria-label="Restart demo call"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <TranscriptFeed 
          messages={activeDemo.transcriptData.messages} 
          currentTime={currentTime} 
          hasStarted={hasStarted} 
          followSignal={followSignal} 
          assistantName={activeDemo.assistantName}
        />
      </div>
    </div>
  );
}
