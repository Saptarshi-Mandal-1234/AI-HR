# AI HR Demo

A lightweight, Vercel-ready HR copilot demo. It uses fictional employees only and keeps the Gemini API key in a secure Vercel server-side environment variable.

Live demo: https://ai-hr-rho-ten.vercel.app/

## What It Demonstrates

- Fictional employee directory and profiles
- First-week onboarding pack generator
- Review draft preparation with human-review boundaries
- Ask AI HR for routine, non-sensitive HR drafts

## Run Locally

This project is designed to deploy on Vercel. Install the Vercel CLI, then run:

```powershell
npx vercel dev
```

Create a local `.env` file from `.env.example` and add your Gemini key. Never commit the `.env` file.

## Deploy Free On Vercel

1. Create a new GitHub repository and upload this folder.
2. Import the repository into Vercel.
3. In Vercel, open **Settings > Environment Variables**.
4. Add `GEMINI_API_KEY` with your Gemini key. Optionally add `GEMINI_MODEL=gemini-3.5-flash`.
5. Deploy.

The key is used only by `api/ai.js`; it is never sent to the browser.

## Important Boundary

This is a public demo, not a production HR system. Do not enter real employee data. The AI feature refuses high-impact employment decisions and keeps human review in control.
