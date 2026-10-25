# Mymind 2.0 — The Extension of Your Mind

> An exquisite, local-first recreation of [mymind.com](https://mymind.com) featuring authentic typography, contextual intelligence, serendipity memory engine, and distraction-free editorial reading.

![Mymind Preview](research/mymind-hero.png)

---

## ✨ Philosophy & Experience

Mymind is built to feel like an extension of your subconscious — not a database, not a social feed, and not a rigid folder hierarchy. No vanity metrics, no collaboration stress, no manual organizing required.

- **Remember Everything Effortlessly:** Quotes, articles, visual inspiration, design notes, books, and code snippets live in a seamless visual canvas.
- **Autonomous Contextual Intelligence:** Local heuristic and embedding-ready tag classification with full explainability ("Why this tag?").
- **Local-First & Private:** Instantaneous reads and mutations powered by client-side IndexedDB persistence.
- **Authentic Typographic System:** Custom-hosted editorial typography using authentic 205TF Louize, Maison Neue, Nunito, and Satoshi font suites.

---

## 🚀 Key Features

### 1. 🎴 Diverse Contextual Card Suite
- **Quotes:** Editorial typography with authentic Louize serif styling and attribution badges.
- **Notes & Thoughts:** Clean, card-based micro-editor with inline markdown readability.
- **Articles & Web Clips:** Hero cover extraction, domain tags, estimated reading duration, and one-click reading mode.
- **Products & Objects:** Price tags, store badges, and brand provenance.
- **Interactive Todos:** Micro-task lists with tactile completion states and progress indicators.
- **Books & Reading Records:** Cover art, authors, publication meta, and personal notes.
- **Images & Visual Inspiration:** Unconstrained visual grid with dynamic aspect-ratio masonry.
- **Code & Developer Snippets:** Syntax highlighting and fast one-click copy.

### 2. 📖 Distraction-Free Reading Mode
- Transforms any web article or long-form note into an editorial magazine spread.
- Three custom-crafted themes: **Sepia** (warm paper), **Light** (clean gallery), and **Dark** (night reading).
- Dynamic typography scale controls: `A` (Compact), `A+` (Standard), and `A++` (Spacious editorial).

### 3. 🎲 Serendipity Mode
- A serendipitous memory resurfacing deck designed to combat digital hoarding.
- Features keyboard shortcuts (`Space` to cycle, `L` to toggle favorite, `Esc` to close).
- Delightful celebratory canvas confetti on rediscovering favorite memories.

### 4. 🔍 Grounded AI — "Ask Your Mind"
- Conversational semantic assistant that answers questions exclusively using your saved library.
- Provides interactive clickable citation pills that link directly to cards in your mind.

### 5. 🎨 Spatial Moodboard Canvas
- Infinite freeform spatial canvas with smooth zooming, panning, and spatial card placement.
- Drag and group cards spatially without restrictive grids.

### 6. ⚡ Universal QuickSave Sheet
- Fast modal capture triggered anywhere in the app (or via keyboard shortcut `N` / floating action button).
- Dedicated input tabs for Links, Notes, Quotes, Todos, and Images.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 with custom dark mode variants and fluid typography
- **Typography:**
  - `Louize-Regular`, `Louize-Italic`, `Louize-Medium`, `Louize-Bold` (205TF)
  - `MaisonNeue-Book`, `MaisonNeue-Medium`, `MaisonNeue-Demi`
  - `Nunito-SemiBold`, `Satoshi-Variable`
- **State & Local Persistence:** Dexie.js (IndexedDB local-first database)
- **Icons & Motion:** Lucide React, Canvas-Confetti, Tailwind transitions

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mymind

# Install dependencies
npm install

# Start the Vite local development server
npm run dev
```

The app will be accessible at `http://localhost:5173`.

### Production Build

```bash
# Typecheck and bundle for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📜 License

Created for educational, design study, and personal productivity purposes. All trademarks and brand identity belong to their respective owners.
