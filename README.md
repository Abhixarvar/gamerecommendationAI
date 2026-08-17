# 🎮 GameMatch AI — Tactical Game Discovery Engine

> **Discover your next gaming obsession through intelligent multi-dimensional preference profiling and AI recommendations.**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF.svg)](https://vitejs.dev/)
[![AI Engine](https://img.shields.io/badge/AI-Claude%20Sonnet-FF4655.svg)](https://www.anthropic.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Report Issue](https://img.shields.io/badge/Issues-Report%20Bug-red.svg)](https://github.com/Abhixarvar/gamerecommendationAI/issues/new)

---

## 📖 Overview

**GameMatch AI** solves the choice paralysis of modern gaming. With thousands of games launching annually across Steam, PlayStation, Xbox, and Switch, standard genre filters fail to capture what makes a game truly resonate with an individual player.

Instead of generic category tags, GameMatch AI performs a **tactical multi-dimensional analysis** of your complete entertainment DNA—cross-referencing your gaming history, cinematic taste in movies, preferred gameplay mechanics, world settings, difficulty tolerances, and custom priority weightings (Story, Combat, Exploration, Graphics, Replayability, Multiplayer).

The platform pairs a sleek, Cyberpunk/Valorant-inspired HUD interface with a **dual recommendation engine** (Real-time LLM inference via Anthropic Claude + deterministic fallback matrix) to deliver personalized game recommendations complete with match percentage scores, custom rationales, and instant deep-links to official storefronts like Steam and Epic Games.

---

## 🗺️ How The Site Works

GameMatch AI operates through an interconnected 5-stage architecture:

```
┌─────────────────────────┐
│ 1. Tactical Quiz Flow   │ ◄── User specifies games, movies, genres, priorities
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 2. Profile Vectorizer   │ ◄── Encodes weights, difficulty, budget & platform
└───────────┬─────────────┘
            │
            ├───► [Anthropic Claude AI API] ───┐
            │                                  │ (JSON Response)
            └───► [Deterministic Fallback] ────┼──► [Match Matrix]
                                               │
                                               ▼
                                  ┌───────────────────────────┐
                                  │ 3. Match Report Dashboard │
                                  └─────────────┬─────────────┘
                                                │
                          ┌─────────────────────┴─────────────────────┐
                          ▼                                           ▼
┌───────────────────────────────────┐       ┌───────────────────────────────────┐
│ 4. Storefront Integration (Steam) │       │ 5. Indexed Game Library (50K+)    │
└───────────────────────────────────┘       └───────────────────────────────────┘
```

---

### 🔍 Stage-by-Stage Breakdown

#### 1. 🎯 Tactical Questionnaire Flow
Users step through an interactive, one-question-at-a-time tactical HUD flow:
1. **Gaming History Search**: Select previously played or favorite titles (e.g. *Elden Ring*, *Valorant*, *Black Myth: Wukong*).
2. **Cinematic Taste**: Select favorite movies/TV shows (e.g. *Dune*, *The Matrix*, *Interstellar*, *Arcane*) to infer narrative, atmospheric, and thematic preferences.
3. **Genre DNA**: Choose preferred genre building blocks (Action, RPG, Soulslike, Roguelike, Cyberpunk, FPS, Strategy, Survival, Co-op).
4. **Priority Weighting Sliders**: Interactively adjust custom importance percentages for:
   - 📖 **Story & Lore**
   - ⚔️ **Combat & Mechanics**
   - 🗺️ **World Exploration**
   - 🎨 **Visuals & Graphics**
   - 🔄 **Replayability**
   - 👥 **Multiplayer / Co-op**
5. **Platform Availability**: Filter for PC, PS5, Xbox Series X|S, Nintendo Switch, Steam Deck, or Mobile.
6. **Difficulty Tolerances**: Choose from *Relaxed / Casual*, *Moderate / Balanced*, *Challenging*, or *Unforgiving / Soulslike*.
7. **Setting & Atmosphere**: Select preferred world types (Sci-Fi, Dark Fantasy, Cyberpunk, Post-Apocalyptic, Mythological, Historical).
8. **Budget & Acquisition**: Specify budget constraints (Any, Under $30, Free to Play, Game Pass / Subscription).

#### 2. 🧠 Smart Recommendation Engine (Dual-Engine System)
- **Primary AI Engine**: Compiles the user's multi-dimensional profile into a structured prompt sent to the **Claude Sonnet API**, requesting tailored recommendations with customized match scores (82%-99%), personalized match rationale ("Why this for you"), standout feature tags, and verified store URLs.
- **Deterministic Fallback Engine**: If network connection or API limits occur, the app seamlessly switches to a local weighted recommendation matrix (`getFallback()`) ensuring zero user interruption.

#### 3. 📊 Interactive Match Report Dashboard
- Displays **Match Percentage Score Rings** rendered with animated SVG radial indicators.
- Provides a **Player Profile Insights** grid summarizing your Genre DNA, Play Style classification (e.g., *Story Hunter*, *Combat Specialist*, *World Explorer*), and Challenge Tolerance.
- Detailed card for each recommended game with:
  - Match percentage score & glowing badge
  - Developer, release year, estimated playtime
  - Genre tags & platform availability
  - "Why This For You" personalized explanation
  - Key feature highlights
  - Direct store purchase buttons

#### 4. 🛒 Store Integrations
- **Steam Store Links**: Direct links to official Steam product pages or optimized search queries.
- **Epic Games Store Links**: Direct links to Epic Games purchase pages.
- **Review Search Links**: Instant Google search queries for gameplay reviews and metacritic scores.

#### 5. 📚 Indexed Game Library & Steam Hub
- Browse through curated 2024–2026 new releases (*Black Myth: Wukong*, *Helldivers 2*, *Warhammer 40k: Space Marine 2*, *Balatro*, *Metaphor: ReFantazio*) alongside all-time classics.
- Instant search bar filtering by game title, developer, or genre.
- Categorized quick filters (New Releases 2024–2026, Action & RPG, Indie & Roguelike, FPS & Strategy, Survival & Co-op).
- Dynamic SVG fallback cover generator for titles without pre-rendered artwork.

---

## ✨ Features Highlights

- ⚡ **Lightning Fast UI**: Built with React 18 & Vite for instant state updates and smooth page transitions.
- 🎯 **Tactical HUD Design**: Sleek dark mode palette (`#0F1923`, `#FF4655`), glowing laser glare buttons, SVG crosshair cursor tracking, scanline overlays, and ambient orb drift animations.
- 🤖 **Interactive Operator AI**: Floating companion callout providing context-aware guidance throughout the quiz and results generation.
- 🔍 **Searchable Multi-Select Component**: Custom popout dropdown for fast lookup across 100+ indexed games and movies.
- 📱 **Fully Responsive Layout**: Dynamic layout adjustments for desktop, tablet, and mobile screens.
- 🐛 **Built-in Issue Reporting**: Integrated GitHub issue submission links in the top navigation bar, results dashboard, and tactical footer.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React 18.3.1, JavaScript (ES6+) |
| **Build Tool & Bundler** | Vite 5.4.19 |
| **Styling & Theme** | Modern Vanilla CSS, CSS Variables, Glassmorphism, Clip-path geometry |
| **Typography** | Google Fonts (*Bebas Neue*, *Barlow Condensed*, *Share Tech Mono*) |
| **AI Inference** | Anthropic Claude API Integration |
| **Icons & Media** | Custom Inline SVG Vector Components (Steam, GitHub, Bug, Scope) |
| **Deployment** | Netlify (`netlify.toml`) |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Abhixarvar/gamerecommendationAI.git
   cd gamerecommendationAI/gamematch-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The compiled production output will be generated in the `dist/` directory.

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## 📂 Project Directory Structure

```
gamematch-ai/
├── dist/                      # Compiled production build
├── public/                    # Static assets
├── src/
│   ├── App.jsx                # Core application, UI components, styles & logic
│   ├── images.js              # High-resolution game cover artwork mapping
│   └── main.jsx               # React DOM entry point
├── index.html                 # Main HTML template & SEO meta tags
├── netlify.toml               # Netlify deployment configuration
├── package.json               # Dependencies and scripts
├── README.md                  # Comprehensive project documentation
└── vite.config.js             # Vite configuration & plugins
```

---

## 🐛 Reporting Issues & Feedback

Encountered a bug, found missing game metadata, or have feature suggestions? We welcome contributions and community feedback!

- 🐛 [**Report a New Bug / Issue**](https://github.com/Abhixarvar/gamerecommendationAI/issues/new)
- 📋 [**Browse Open Issues**](https://github.com/Abhixarvar/gamerecommendationAI/issues)
- ⭐ [**Star the GitHub Repository**](https://github.com/Abhixarvar/gamerecommendationAI)

---

## 📄 License

Distributed under the **MIT License**.

---

<p align="center">
  <b>GameMatch AI</b> &bull; Built with ❤️ for Gamers Everywhere
</p>
