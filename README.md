# Exhale - Quit Vaping Tracker & Recovery Companion

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/buzzunitsa-sys/exhale-quit-vaping)

Exhale is a comprehensive, mobile-first web application designed to empower users to overcome vaping addiction through gamification, health tracking, and financial incentives. Built specifically with Android mobile usage patterns in mind, the UI features a bottom-navigation architecture for easy one-handed use.

The core of the application is the 'Freedom Dashboard', which displays a real-time counter of time smoke-free, money saved, and life regained. The application uses a simulated authentication system where users 'login' with an email to persist their quit date and settings across devices, powered by Cloudflare Durable Objects for backend state management.

## Features

- **Freedom Dashboard**: A main hub featuring a large pulsating 'Time Free' counter, quick stats cards (Money Saved, Pods Avoided), and daily motivation quotes.
- **Health Timeline**: Visualizes physiological improvements over time (e.g., oxygen levels returning to normal) using circular progress indicators.
- **Achievements System**: Gamifies the journey with unlockable badges for milestones (e.g., '1 Week Free', 'Warrior', '$100 Saved').
- **Journaling**: Users can log cravings to track triggers and patterns.
- **Profile Management**: Settings to adjust quit dates, costs per pod/vape, and daily usage frequency.
- **Mobile-First Design**: Optimized for mobile viewports with dynamic height handling and touch-friendly targets.
- **Cloud Persistence**: Data is stored securely using Cloudflare Durable Objects, allowing users to access their progress across devices.

## Tech Stack

**Frontend:**
- **React 18** with **Vite**
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn UI** for accessible component primitives
- **Framer Motion** for smooth animations and micro-interactions
- **Recharts** for data visualization
- **Zustand** for client-side state management
- **Lucide React** for iconography

**Backend:**
- **Cloudflare Workers** for serverless compute
- **Hono** web framework for routing
- **Cloudflare Durable Objects** for stateful storage and consistency

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)
- A Cloudflare account (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/exhale-quit-tracker.git
   cd exhale-quit-tracker
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Development

To start the development server with hot reload:

```bash
bun run dev
```

This will start the Vite development server, typically at `http://localhost:5173`.

### Project Structure

- `src/`: Frontend React application code.
  - `components/`: Reusable UI components (Shadcn).
  - `pages/`: Application views (Dashboard, Health, Achievements).
  - `hooks/`: Custom React hooks.
  - `lib/`: Utilities and API clients.
- `worker/`: Cloudflare Worker and Durable Object code.
  - `index.ts`: Worker entry point.
  - `entities.ts`: Durable Object entity definitions.
  - `user-routes.ts`: API route definitions.
- `shared/`: Types and constants shared between frontend and worker.

## Deployment

This project is configured to deploy to Cloudflare Workers.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/buzzunitsa-sys/exhale-quit-vaping)

To deploy manually from your terminal:

1. Login to Cloudflare (if not already logged in):
   ```bash
   npx wrangler login
   ```

2. Deploy the application:
   ```bash
   bun run deploy
   ```

This command builds the frontend assets and deploys the Worker script along with the Durable Object configuration.

**Note:** This project uses `wrangler.jsonc` for configuration. Please do not modify the binding names (specifically `GlobalDurableObject`) as the application logic depends on this specific configuration.

## License

This project is open source and available under the MIT License.