# kiko.ai Landing Page — Implementation Plan

## Goal

Build a responsive, production-quality landing page for **kiko.ai**, an AI voice receptionist service.

The page must be implemented as real UI, not as screenshots placed on the page. Use the supplied screenshots only as visual references for layout, typography, spacing, color, and component styling.

The hero must contain a functional demo-call player. When the visitor presses play, the WAV recording plays and the transcript from the JSON file appears in sync with the conversation.

## Files Supplied in the Repository Root

Expect these source assets beside this `plan.md` file:

- A transcript JSON file, expected name: `fixora_demo_transcript.json`
- A stereo WAV recording, expected name: `fixora-demo-stereo.wav`
- Hero reference screenshot, preferred name: `01-hero-reference.png`
- Benefits reference screenshot, preferred name: `02-benefits-reference.png`
- Calculator reference screenshot, preferred name: `03-calculator-reference.png`

If the exact filenames differ, inspect the root-level `.json`, `.wav`, and `.png` files and identify them by content. Do not stop only because a filename differs.

Keep the root source files unchanged. Copy them into appropriate application directories when required by the framework, for example:

- WAV → `public/demo/fixora-demo-stereo.wav`
- JSON → `src/data/fixora-demo-transcript.json`
- Screenshots may remain development references and must not be shipped as page backgrounds.

## Working Rules

1. Inspect the existing repository before installing or replacing anything.
2. Preserve the existing framework, package manager, configuration, and unrelated code.
3. If this is an empty repository, use:
   - Next.js App Router
   - TypeScript
   - Tailwind CSS
   - shadcn/ui
   - Lucide icons
4. Use reusable React components instead of putting the whole page in one file.
5. Do not use API keys, Vapi endpoints, n8n webhooks, or backend services for this landing-page demo.
6. Do not use the screenshots as large image backgrounds or recreate them through hundreds of hard-coded absolute positions.
7. Rebuild the design with semantic HTML, CSS/Tailwind, shadcn primitives, and responsive layout rules.
8. Do not copy ElevenLabs branding, logo, or proprietary assets. The approved screenshots establish a general editorial voice-tech direction, but the final identity must remain original to **kiko.ai**.

## Approved Visual Direction

Use the three supplied screenshots as the primary UI references.

### Design language

- Warm off-white background
- Ink-black typography and interface surfaces
- Signal-green accent used sparingly
- Bold, tight grotesk-style headlines
- Generous negative space
- Thin gray or black borders
- Modest corner radii, generally `10px–14px`
- Minimal shadows
- Editorial grid and subtle waveform motifs
- shadcn-style controls and cards
- No purple
- No glassmorphism
- No large gradients
- No excessive pill-shaped elements
- No stock photos or 3D illustrations

### Suggested design tokens

Use these as starting points and tune them against the screenshots:

```css
--background: #f8f8f3;
--foreground: #090a09;
--card: #fdfdf9;
--muted: #6d706b;
--border: #d8dad3;
--signal: #a8ff1f;
--signal-strong: #8ee600;
--dark-panel: #111310;
```

Use a modern sans-serif such as Geist or an existing project font. Avoid importing unnecessary font families.

## Page Structure

Create these components or close equivalents:

```text
app/page.tsx
components/site-header.tsx
components/hero-section.tsx
components/demo-call-player.tsx
components/transcript-feed.tsx
components/benefits-section.tsx
components/service-teams-section.tsx
components/opportunity-calculator.tsx
components/consultation-section.tsx
components/consultation-form.tsx
components/waveform-mark.tsx
src/data/fixora-demo-transcript.json
public/demo/fixora-demo-stereo.wav
```

Adapt paths to the existing repository structure when necessary.

## Section 1 — Header, Hero, and Demo Call

Recreate the approved hero screenshot as responsive UI.

### Header

- Original kiko.ai waveform mark plus text: `kiko.ai`
- Navigation:
  - Home
  - Services
  - About
  - Contact
- Right-side button: `Book a Consultation`
- Do not include an Industries menu.
- On mobile, use an accessible compact menu.

### Hero copy

- Eyebrow: `AI Receptionist • Call Answering • Appointment Booking • Support`
- Headline: `Conversations handled. Business moving.`
- Supporting copy: `A natural AI receptionist that answers every call, books appointments, and keeps your business available.`
- Primary button: `Hear kiko.ai in action`

Clicking `Hear kiko.ai in action` must scroll to the demo player and start playback if browser autoplay rules permit. If programmatic playback is blocked, focus the play control and leave it ready for one user click.

### Demo-call player

Build a real audio player rather than using the browser's default `<audio controls>` interface.

Required controls:

- Play and pause
- Seekable progress slider
- Current time
- Total duration
- Restart button
- Clear playing/paused state
- Keyboard-operable controls
- Accessible labels

Use a hidden or visually unobtrusive HTML `<audio>` element as the playback engine. The supplied stereo recording already contains both Mia and the customer.

### Transcript data

Read the supplied JSON rather than hard-coding the conversation. It is expected to resemble:

```json
{
  "title": "Fixora Home Repair Demo Call",
  "audioFile": "fixora-demo-stereo.wav",
  "durationSeconds": 175.447,
  "participants": {
    "assistant": "Mia",
    "customer": "Alex Carter"
  },
  "messages": [
    {
      "id": 1,
      "speaker": "assistant",
      "label": "Mia",
      "start": 0.863,
      "end": 3.983,
      "text": "..."
    }
  ]
}
```

Validate the JSON at startup/build time and fail gracefully if a malformed entry is encountered.

### Transcript synchronization

Implement synchronization from `audio.currentTime`:

1. Before playback, show the player in a clean ready state.
2. Once playback starts, reveal messages when `currentTime >= message.start`.
3. Highlight the active message when `start <= currentTime < end`.
4. Style assistant messages on the left and customer messages on the right.
5. Label speakers as `Mia — kiko.ai` and `Customer`.
6. Auto-scroll the transcript so the active message remains visible.
7. If the user manually scrolls upward, temporarily stop forced auto-scrolling. Resume it when the user returns near the bottom or seeks/presses play again.
8. Seeking backward must hide messages that occur after the new time.
9. Seeking forward must immediately reveal all messages whose start time has passed.
10. Restart must set the audio to zero, clear future messages, and begin again.
11. Pause must freeze the transcript state.
12. At the end, keep the full conversation visible and change the main control to replay.

Use `requestAnimationFrame`, the audio `timeupdate` event, or a small controlled interval. Avoid excessive React rerenders.

### Transcript styling

- Near-black audio/control header
- Warm-white transcript area
- Small signal-green live indicator
- Assistant waveform avatar on the left
- Minimal customer avatar on the right
- Modest chat-bubble radii
- Small timestamp above or beside each message
- Smooth, restrained reveal motion
- Respect `prefers-reduced-motion`

## Section 2 — Minimal Benefits Panel

Build the latest approved second-section screenshot as code. This is the simplified version with one bordered panel divided into exactly three benefit columns. Do not rebuild the earlier six-card bento concept.

### Heading

- Eyebrow: `WHY KIKO.AI`
- Headline: `Less call handling. More business moving.`
- Intro: `kiko.ai takes care of routine calls—from first question to confirmed appointment—so your team can stay focused.`

### Benefits

Use exactly these three benefits:

1. **Available when you aren’t**  
   `Answers customers during busy hours, after closing, and whenever your team needs backup.`

2. **Turns calls into bookings**  
   `Checks availability, gathers the right details, and confirms the next step while the caller is still on the line.`

3. **Brings in a person when needed**  
   `Routes unusual or sensitive conversations to your team with the context intact.`

### Layout and visuals

- Align the heading block to the left within the main page container.
- Place one large bordered panel below the heading.
- Divide the panel into three equal desktop columns with thin vertical rules.
- Give each column generous padding and plenty of empty space.
- First benefit visual: a large `24 / 7` typographic mark with one small signal-green live dot.
- Second benefit visual: one compact appointment strip showing `10:00 AM`, `Confirmed`, and a green check. Do not create a full calendar.
- Third benefit visual: one simple AI waveform icon, a thin arrow, and one human avatar.
- Use signal green only for the status dot, confirmed state, check, and subtle handoff accent.
- Use little or no shadow and a modest `10px–12px` outer radius.

Do not add extra benefit cards, background waveforms, a bento mosaic, a full calendar, a call console, chat bubbles, badges, a security checklist, unsupported claims, fake integrations, customer logos, or a CTA in this section.

## Section 3 — Service Teams

Build the service-teams section shown in `section_up.png` as responsive UI. Place it immediately after the benefits section and directly before the opportunity calculator.

### Copy

- Eyebrow: `BUILT FOR SERVICE TEAMS`
- Headline: `Every call has a next step.`
- Intro: `kiko.ai adapts to the conversations that keep appointment-led businesses moving.`

### Service categories

Use one unified thin-bordered panel containing four equal desktop columns:

1. **Home services** — `Turn urgent questions into scheduled visits.`
2. **Health & wellness** — `Help callers find and book the right appointment.`
3. **Property teams** — `Qualify interest and keep viewings moving.`
4. **Professional services** — `Capture intent and route every enquiry clearly.`

Use a simple black line icon on a pale signal-green circle for each category. At the bottom of the panel, include one pale-green capability strip containing `Answers`, `Qualifies`, `Schedules`, and `Escalates`.

Add the CTA `See what kiko.ai could handle for your team →` below the panel and link it to the consultation form. Use four columns on desktop, two on tablet, and one stacked column on mobile with clear internal dividers.

## Section 4 — Opportunity Calculator

Build the calculator shown in the third approved screenshot as a real interactive component.

### Copy

- Eyebrow: `THE COST OF A MISSED CALL`
- Headline: `Put a number on the calls you can’t answer.`
- Intro: `Use your own numbers to estimate the booking value that may be slipping through during busy hours and after closing.`

### Inputs

Provide synchronized slider and numeric-input controls for:

| Input | Default | Suggested range | Step |
| --- | ---: | ---: | ---: |
| Missed calls each week | 8 | 0–100 | 1 |
| Average booking value | $180 | $0–$5,000 | $10 |
| Calls that typically book | 35% | 0–100% | 1% |

Clamp invalid values safely. Users must be able to type values as well as move sliders.

### Formula

```text
weeklyOpportunity = missedCallsPerWeek × averageBookingValue × (bookingRate / 100)
monthlyOpportunity = weeklyOpportunity × 52 / 12
annualOpportunity = weeklyOpportunity × 52
```

With defaults, display:

- `$2,184 / month`
- `$26,208 / year`

Format output with `Intl.NumberFormat` and round to whole dollars for display.

### Calculator UI

- Split editorial layout on desktop
- Calculator card on the right
- Three slider/input rows
- Near-black results panel
- Signal-green monthly figure
- Annual figure underneath
- Small 12-month cumulative/projection visualization
- Disclaimer: `Illustrative estimate based on the values above. Actual results vary.`

Do not describe the result as guaranteed revenue or guaranteed savings.

## Section 5 — Consultation Booking

Place the consultation booking section after the opportunity calculator and before the footer. Keep the two-column editorial layout, accessible validated form, server-only Neon submission, and success confirmation described by the implemented design. The section retains `id="contact"` as the stable target for navigation and service-team CTAs.

## Responsive Behavior

Test at minimum:

- 1440px desktop
- 1024px laptop/tablet landscape
- 768px tablet
- 390px mobile

Requirements:

- Avoid horizontal overflow.
- Stack the hero and calculator cleanly on smaller screens.
- Keep the benefit panel as three columns on wide screens; stack it into one column with horizontal dividers on narrow screens. Use two columns only when the available width genuinely supports the copy without crowding.
- Keep audio controls usable at 320px width.
- Use fluid type with `clamp()` where appropriate.
- Keep tap targets at least 44px.
- Do not hide essential copy or functionality on mobile.

## Accessibility

- Semantic section headings and landmarks
- Visible keyboard focus states
- Buttons must be real `<button>` elements
- Sliders and numeric fields need labels and current-value announcements
- Audio state must not depend only on color
- Sufficient contrast for signal green against both light and dark surfaces
- Decorative waveform elements must be hidden from assistive technology
- Respect reduced-motion preferences

## Animation

Use animation sparingly:

- Gentle transcript message reveal
- Subtle active waveform movement while audio is playing
- Small hover/focus transitions
- Optional section entrance transitions only if they do not delay content

Do not add scroll-jacking, excessive parallax, glowing cursor effects, or continuous decorative animation.

## Content and Brand Constraints

- Brand name is always `kiko.ai`.
- The demo business inside the recording remains `Fixora Home Repair`; this is intentional because it demonstrates a customer deployment.
- Do not expose Vapi API keys, call IDs, webhook URLs, or n8n details.
- Do not call live booking tools from the marketing website.
- Do not invent testimonials, usage numbers, client logos, certifications, or performance statistics.
- Do not change the supplied transcript timing to make the design easier.

## Implementation Order

1. Inspect the repository and supplied root assets.
2. Confirm the transcript JSON parses and the WAV plays locally.
3. Establish design tokens, typography, global layout, and responsive container.
4. Build the site header and hero.
5. Build and test the audio player independently.
6. Add transcript synchronization, seeking, replay, and auto-scroll behavior.
7. Build the minimal three-benefit panel.
8. Build the service-teams panel and consultation CTA.
9. Build the interactive opportunity calculator.
10. Build the consultation form and database submission flow.
11. Add responsive behavior and restrained motion.
12. Complete accessibility checks.
13. Run lint, type checks, tests, and a production build.

## Verification Checklist

- [ ] The page visually follows all supplied screenshots without embedding them as UI.
- [ ] Brand is consistently `kiko.ai`.
- [ ] Industries is absent from the navbar.
- [ ] WAV playback works in current Chrome, Edge, Firefox, and Safari where supported.
- [ ] Play, pause, seek, and restart work.
- [ ] Transcript messages appear at their JSON timestamps.
- [ ] Seeking backward removes future messages.
- [ ] Seeking forward restores the correct transcript state.
- [ ] The active message stays visible without trapping manual scrolling.
- [ ] The service-teams section appears between benefits and the calculator and links to the consultation form.
- [ ] Calculator defaults produce `$2,184 / month` and `$26,208 / year`.
- [ ] Calculator updates immediately when any input changes.
- [ ] No unsupported claims or secrets appear in client code.
- [ ] Keyboard navigation and visible focus states work.
- [ ] Reduced-motion mode remains usable.
- [ ] No horizontal overflow at mobile widths.
- [ ] Lint and type checks pass.
- [ ] Production build succeeds.

## Final Handoff

When implementation is complete, report:

1. Files created or changed
2. Commands used to run the project
3. Test/build results
4. Any assumptions made about asset filenames
5. Any remaining placeholders, such as the final consultation-booking URL

Do not declare completion if the demo audio or transcript synchronization is still mocked.
