# WanderWise — Frontend Rules

## Tech Stack
- Plain **HTML5**, **CSS3**, **Vanilla JavaScript** only. No frameworks, no build tools.
- Single entry point: `index.html` loads `style.css` and `script.js`.
- Load directly in the browser or via a simple static file server.

## Architecture
- **Single-page site** with smooth scroll navigation (Welcome → Destinations → About → Footer).
- **Chat overlay** on top (floating button bottom-right, opens/closes a panel).
- All dynamic content is fetched from `https://localhost:3000/api/destinations`.

## API Contracts
Every request to the backend returns:
```json
{ "success": true/false, "message": "...", "data": {...} }
```

On error, always show: *"Arre yaar, kuch toh gadbad hui! Thoda ruko aur dobara try karo."*

## Styling Pillars
- **Color palette (CSS variables)**:
  - `--sky-blue`: #1E3A8A (deep header blue)
  - `--sky-light`: #E0F2FE (soft sky)
  - `--sunset-orange`: #F97316 (warm accent, buttons)
  - `--sand-beige`: #FFF8DC (soft background)
  - `--ocean-teal`: #0891B2 (secondary accent)
  - `--text-dark`: #1F2937
  - `--text-light`: #9CA3AF
  
- **Typography**: Clean sans-serif, generous line-height.
- **Animations**: All via CSS `@keyframes` (no JS animations except scroll-to).
- **Responsive**: Mobile-first, break at 768px (tablet) and 1024px (desktop).

## Specific UI Behaviors

### Welcome Screen
- Full-page hero with a gradient background (sky-blue to sky-light).
- Centered tagline: *"Duniya Dekhni Hai? Chalo Shuru Karte Hain"* (bold, large, 2.5rem).
- Big **START EXPLORING** button (sunset-orange, rounded, 1rem padding).
- On click: plays a subtle whoosh sound (audio file or Web Audio API) and triggers floating paper plane (✈) animations across the screen for 3 seconds.

### Destinations Section
- **Filter bar**: 4 buttons (Mountains, Beaches, Heritage Cities, Hidden Gems).
- Active filter is sunset-orange, others are light.
- Cards are fetched from `/api/destinations` and filtered by category.
- **Each card shows**:
  - Destination name (bold)
  - State (small, gray)
  - Hinglish description with emoji (italics)
  - Adventure level (1–5 stars, clickable but non-interactive)
  - Approx cost per person in ₹
  - Best season
  - Top 2 things to do (bullet list)
  - Ideal days
  - If it's a "Tara's Top Pick", a small badge with a sparkle emoji (✨)

### About Section
- Centered, with a **slowly spinning compass** (pure CSS animation, 10s rotation loop).
- Beneath: a counter that **animates from 0 to 50000** when scrolled into view (use Intersection Observer).
- Text: *"50,000+ happy travellers have explored the world with Tara"*.

### Footer Ticker
- Infinitely scrolling ticker of Hinglish messages (e.g., "Powered by wanderlust • Tara ne khud explore kiya • Made with chai and curiosity").
- Use CSS animation, wrap around seamlessly.

### Audio & Ambient
- A **muted-by-default** ocean waves loop (low volume, played if user clicks unmute).
- Mute/unmute toggle icon in the top-right corner (🔊 / 🔇).
- Toggle state persists in `localStorage`.

### Chat Panel
- **Floating button** (bottom-right, sunset-orange, circular, 60px).
- Clicking opens a **side panel** (right side on desktop, full overlay on mobile).
- Chat bubbles: user (right, sky-light bg), Tara (left, sand-beige bg).
- **Typing indicator**: three dots bouncing animation while Tara responds.
- Streamable chat replies: words appear one-at-a-time as they arrive from the server.
- **4 quick-reply chips** (gray buttons, shown before first message):
  - "Best place for monsoon?"
  - "Budget-friendly trips?"
  - "Honeymoon destinations?"
  - "Adventure spots?"
- Error message on network failure: *"Arre yaar, kuch toh gadbad hui! Thoda ruko aur dobara try karo."*

## Performance
- Lazy-load images (if used) with native `loading="lazy"`.
- Minimize repaints: use CSS transforms for animations, not top/left.
- Chat scrolling: `scrollIntoView()` with instant scroll, wrapped in `requestAnimationFrame` for layout settlement.
