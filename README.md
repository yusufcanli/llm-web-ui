# LLM Web UI

A lightweight web UI for interacting with OpenAI-compatible LLM endpoints. Built with Next.js and React, it supports streaming chat completions, model selection, saving/loading chats, quick prompts, and local persistence.

---

## Key features

- Connects to OpenAI-compatible endpoints (expects OpenAI-compatible REST paths such as `/v1/models` and `/v1/chat/completions`).
- Streaming chat responses (uses the streaming output from `/v1/chat/completions`).
- Model selection (UI lists models from the server `/v1/models`).
- Save, load, download and upload chats as JSON.
- Quick prompts and a system prompt to guide assistant behavior.
- Local persistence using localforage (stored keys: `aiChats`, `aiPrompts`, and per-chat keys like `<chatId>_chats`).
- Simple token estimate and message editing utilities in the UI.

The code that powers these features lives mostly in `src/store/chatStore.ts`, UI components live in `src/components/` and the main page is `src/app/page.tsx`.

## Quick start

Prerequisites:

- Node.js 18+ (recommended)
- npm (or yarn/pnpm)

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

## Configuration

This project expects an environment variable `NEXT_PUBLIC_API_URL` that points to an OpenAI-compatible base URL (for example, an OpenAI proxy, self-hosted LLM server, or the OpenAI API if you expose it through a secure server).

Example `.env` / `.env.local`:

```
NEXT_PUBLIC_API_URL=https://api.openai.com
```

Notes:

- The store defaults to `process.env.NEXT_PUBLIC_API_URL` but also respects an in-app `setApiRoute` which saves the value to `localStorage` (see `src/store/chatStore.ts`).
- The app fetches models from `GET ${apiRoute}/v1/models` and sends chat requests to `POST ${apiRoute}/v1/chat/completions` (streaming enabled).


## Usage highlights (UI)

- Sidebar: lists saved chats, create new chat, upload a chat JSON, delete or rename chats.
- Chat area: read streaming assistant responses, stop a stream, download current chat as JSON.
- Model & prompts: open the Model dialog to select a model from the server; edit system prompt or add quick prompts with the Prompt dialog.


## Troubleshooting

- If the app shows a server error on startup, check the browser console and ensure `NEXT_PUBLIC_API_URL` is correct and your endpoint supports the expected OpenAI-compatible paths.
- The app expects streaming responses from `/v1/chat/completions`. If your server doesn't support streaming, responses may not render progressively.

