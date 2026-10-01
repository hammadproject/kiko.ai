import fixoraTranscriptSource from "./fixora-demo-transcript.json";
import aspenParkTranscriptSource from "./aspen-park-dental-demo-transcript.json";

export type Speaker = "assistant" | "customer";

export interface TranscriptMessage {
  id: number;
  speaker: Speaker;
  label: string;
  start: number;
  end: number;
  text: string;
}

export interface DemoTranscript {
  title: string;
  audioFile: string;
  durationSeconds: number;
  participants: { assistant: string; customer: string };
  messages: TranscriptMessage[];
}

export type VoiceDemo = {
  id: string;
  category: string;
  company: string;
  assistantName: string;
  scenario: string;
  transcriptData: DemoTranscript;
};

function isMessage(value: unknown): value is TranscriptMessage {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "number" &&
    (item.speaker === "assistant" || item.speaker === "customer") &&
    typeof item.label === "string" &&
    typeof item.start === "number" &&
    item.start >= 0 &&
    typeof item.end === "number" &&
    item.end > item.start &&
    typeof item.text === "string" &&
    item.text.trim().length > 0
  );
}

function parseTranscript(value: unknown): DemoTranscript {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const participantSource =
    source.participants && typeof source.participants === "object"
      ? (source.participants as Record<string, unknown>)
      : {};
  const rawMessages = Array.isArray(source.messages) ? source.messages : [];
  const messages = rawMessages.filter(isMessage).sort((a, b) => a.start - b.start);

  if (messages.length !== rawMessages.length) {
    console.error("Some demo transcript entries were malformed and have been omitted.");
  }

  return {
    title: typeof source.title === "string" ? source.title : "Demo call",
    audioFile: typeof source.audioFile === "string" ? source.audioFile : "fixora-demo-stereo.wav",
    durationSeconds:
      typeof source.durationSeconds === "number" ? source.durationSeconds : messages.at(-1)?.end ?? 0,
    participants: {
      assistant:
        typeof participantSource.assistant === "string" ? participantSource.assistant : "Assistant",
      customer:
        typeof participantSource.customer === "string" ? participantSource.customer : "Customer",
    },
    messages,
  };
}

export const fixoraTranscript = parseTranscript(fixoraTranscriptSource);
export const aspenParkTranscript = parseTranscript(aspenParkTranscriptSource);

export const voiceDemos: VoiceDemo[] = [
  {
    id: "home-services",
    category: "Home Services",
    company: "Fixora Home Repair",
    assistantName: "Mia — Home Services Assistant",
    scenario: "Plumbing service booking",
    transcriptData: fixoraTranscript,
  },
  {
    id: "dental-clinic",
    category: "Dental Clinic",
    company: "Aspen Park Dental Care",
    assistantName: "Daniel — Dental Reception Assistant",
    scenario: "New-patient appointment booking",
    transcriptData: aspenParkTranscript,
  },
];
