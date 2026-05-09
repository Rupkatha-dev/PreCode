# PreCode

PreCode is an AI-powered educational platform designed to cultivate better programming habits by encouraging students to plan and specify their logic before writing a single line of code. It enforces a structured workflow that emphasizes deep thinking, requirement gathering, and self-reflection.

## Core Features

- **Specification Phase**: Students must define the behavior, inputs, outputs, and edge cases of their logic. An AI tutor provides feedback and asks clarifying questions without giving away solutions.
- **Coding Phase**: Once the specification is approved, students implement their solution using an integrated Monaco Editor. Real-time AI assistance is available for syntax help, but the tutor remains strict about debugging.
- **Reflection Phase**: After submission, the AI compares the code against the initial specification, identifies mismatches, and prompts the student for a final reflection on their learning process.
- **Persistence**: All sessions, including specifications, code, and reflections, are securely stored for future review.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Editor**: Monaco Editor (@monaco-editor/react)
- **AI Engine**: Groq SDK (Llama 3.3 70B)
- **Database**: Neon (Serverless PostgreSQL)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### 1. Prerequisites

Ensure you have Node.js installed on your machine. You will also need:
- A Groq API Key
- A Neon Database Connection String

### 2. Environment Setup

Create a `.env` file in the root directory and add the following variables:

```env
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_neon_database_url
```

### 3. Database Initialization

Run the setup script to create the necessary tables in your Neon database:

```bash
node setup-db.mjs
```

### 4. Installation

Install the project dependencies:

```bash
npm install
```

### 5. Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Educational Philosophy

PreCode is built on the principle that programming is 80% thinking and 20% typing. By forcing a "Think-First" approach, it prevents the common pitfall of "guess-and-check" coding. The AI tutor is specifically tuned to be a facilitator rather than a solver, ensuring that the cognitive heavy lifting stays with the student.
