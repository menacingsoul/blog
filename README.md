# BlogVerse

BlogVerse is a modern, full-stack blogging platform where ideas find their voice. It allows users to write, publish, and engage with blogs seamlessly. The platform leverages edge-to-edge Next.js features and integrates with advanced AI tools to enable deep semantic searches across your articles.

## Features

- **Rich Text Editing:** Integrated with TipTap to provide a fully featured WYSIWYG rich text editor with support for images, formatting, code blocks, and markdown shortcuts.
- **Smart Semantic Search:** Powered by Google Generative AI (Gemini) and `pgvector`, users can search for blogs contextually rather than just by stark keywords.
- **Dynamic Dashboard & Analytics:** Users can track their views, upvotes, and overall engagement using Chart.js powered visual charts.
- **Robust Authentication:** Secure and seamless login capabilities utilizing NextAuth.js (supporting Google Provider) and JWT session management.
- **Fully Responsive Modern UI:** Built using Tailwind CSS, Radix UI primitives, Lucide React icons, and custom CSS animations, ensuring a sleek, premium, user-friendly interface.
- **Interactivity:** Support for commenting, replies, upvoting, saving blogs to reading history, and bookmarking.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (with `pgvector` extension)
- **ORM:** Prisma Client
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS + UI components (Radix UI)
- **Editor:** TipTap
- **AI Integration:** Google Generative AI (`@google/generative-ai`)
- **Image Uploadings:** Cloudinary (`next-cloudinary`)
- **Charts:** Chart.js + `react-chartjs-2`

## Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm/yarn/pnpm installed. You also need a PostgreSQL database with the `pgvector` extension enabled.

### 1. Clone the repository
```bash
git clone <repository-url>
cd blog
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` and `.env.local` file in the root of the project to securely house your keys.

**`.env`**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/blogverse"
```

**`.env.local`**
```env
# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"

# NextAuth (Authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Google OAuth (for signing in)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Generative AI (for vector embeddings / semantic search)
GOOGLE_API_KEY="your-gemini-api-key"
```

### 4. Database Setup
Ensure that your connected PostgreSQL database supports the `vector` extension. Push your schema using Prisma:

```bash
npx prisma db push
```

*(If you are setting this up for the first time, make sure to manually execute `CREATE EXTENSION IF NOT EXISTS vector;` in your SQL shell before pushing the schema, if Prisma doesn't do it automatically depending on your permissions).*

### 5. Running the Application
Start the development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

## Project Structure

- `/app`: Next.js App Router (Pages, API Routes, Layouts).
- `/components`: Reusable UI components categorized by feature (e.g., `/cards`, `/blog`, `/home`, `/profile`).
- `/prisma`: Contains the `schema.prisma` definitions for your database.
- `/utils`: Helper functions and utilities (e.g., embeddings generator, sanitized HTML helpers, reading time calculators, DB connection).
- `/lib`: Library configurations (e.g., NextAuth config options).

## License
This project is for educational/portfolio purposes and is not licensed for commercial extraction yet.
