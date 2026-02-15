# Linko

A modern real-time chat and video calling application. Sign in, find users, start conversations, and hop on video calls — all in one place.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with React 19 & Turbopack
- **Database & Backend:** [Convex](https://convex.dev) (real-time database, server functions)
- **Authentication:** [Clerk](https://clerk.com) (sign-in/sign-up, session management, middleware protection)
- **Chat:** [Stream Chat React SDK](https://getstream.io/chat/) (messaging, channel lists, threads)
- **Video:** [Stream Video React SDK](https://getstream.io/video/) (video calls with speaker layout, call controls)
- **Styling:** Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com/) components
- **Language:** TypeScript

## Features

- **Authentication** — Secure sign-in/sign-up powered by Clerk with protected routes via middleware
- **Real-time Messaging** — Instant 1-on-1 and group chat with message threads, powered by Stream Chat
- **Video Calling** — Start a video call from any chat channel with shareable invite links
- **User Search** — Find other users by name or email and start new conversations
- **Channel Management** — View your channels sorted by latest activity, leave chats when you're done
- **Responsive Sidebar** — Collapsible sidebar with channel list and user profile
- **User Sync** — Clerk user data is automatically synced to Convex on sign-in

## Project Structure

```
linko/
├── actions/           # Server actions (Stream token creation)
├── app/
│   ├── page.tsx       # Landing page
│   └── (signed-in)/   # Authenticated routes
│       └── dashboard/
│           ├── page.tsx              # Chat view
│           └── video-call/[channelId]/ # Video call view
├── components/        # React components (sidebar, dialogs, UI primitives)
├── convex/            # Convex schema, queries, and mutations
├── hooks/             # Custom hooks (debounce, user search, chat creation)
├── lib/               # Stream client setup (client & server)
└── middleware.ts      # Clerk auth middleware
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A [Clerk](https://clerk.com) account
- A [Convex](https://convex.dev) account
- A [Stream](https://getstream.io) account (Chat & Video enabled)

### Environment Variables

Create a `.env.local` file in the project root with the following:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_JWT_ISSUER_DOMAIN=your_clerk_jwt_issuer_domain

NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET_KEY=your_stream_api_secret
```

### Installation

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/your-username/linko.git
   cd linko
   pnpm install
   ```

2. Start the Convex development server:

   ```bash
   npx convex dev
   ```

3. In a separate terminal, start the Next.js dev server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start Next.js dev server with Turbopack |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `npx convex dev` | Start Convex dev server & sync schema |
