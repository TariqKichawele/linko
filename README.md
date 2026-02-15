# Linko

A real-time chat and video calling application built with modern web technologies.

## Tech Stack

- **Framework:** Next.js 15 (React 19)
- **Database:** Convex
- **Auth:** Clerk
- **Chat & Video:** Stream Chat SDK & Stream Video SDK
- **Styling:** Tailwind CSS + shadcn/ui

## Features

- Instant messaging with real-time delivery
- Video calls
- Group chats
- User search and chat creation

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A [Clerk](https://clerk.com) account
- A [Convex](https://convex.dev) account
- A [Stream](https://getstream.io) account

### Setup

1. Clone the repository and install dependencies:

   ```bash
   pnpm install
   ```

2. Set up your environment variables (Clerk, Convex, and Stream keys).

3. Start the Convex development server:

   ```bash
   npx convex dev
   ```

4. In a separate terminal, start the Next.js dev server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

