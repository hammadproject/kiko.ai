"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { TranscriptFeed } from "@/components/transcript-feed";
import { demoTranscript } from "@/src/data/transcript";

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function DemoCallPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(demoTranscript.durationSeconds);
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
    <div id="demo-call" className="mx-auto mt-12 max-w-[1160px] overflow-hidden rounded-[14px] border border-black bg-dark-panel shadow-[0_18px_50px_rgba(17,19,16,0.08)] scroll-mt-6">
      <audio
        ref={audioRef}
        preload="metadata"
        src="/demo/fixora-demo-stereo.wav"
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

      <div className="flex min-h-[58px] items-center justify-between border-b border-white/10 px-5 text-white sm:px-7">
        <div className="flex items-center gap-3 font-semibold"><span className="size-3 rounded-full bg-signal" aria-hidden="true" />Demo Call Experience</div>
        <span className="font-mono text-sm tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>
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

      <TranscriptFeed messages={demoTranscript.messages} currentTime={currentTime} hasStarted={hasStarted} followSignal={followSignal} />
    </div>
  );
}
