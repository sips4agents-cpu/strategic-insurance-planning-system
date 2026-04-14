# Strategic Insurance Planning System

GitHub-ready Next.js + Supabase starter for a secure insurance agency portal.

## Features
- Passwordless email login with Supabase OTP
- Protected `/app` area
- Client intake form
- Client list
- Security checklist
- Document vault page
- Supabase schema with row level security

## 1. Install
```bash
npm install
```

## 2. Configure environment variables
Copy `.env.example` to `.env.local` and set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Run locally
```bash
npm run dev
```

## 4. Deploy to Vercel
- Push this folder to GitHub
- Import the repo in Vercel
- Add the same environment variables in Vercel
- Deploy

## 5. Supabase setup
- Run `supabase/schema.sql`
- Create a private storage bucket named `client-documents`
- Enable email auth

## Notes
This starter is meant to be your secure base. Add your calculator and workflow logic next, then test in Preview before rolling into Production.
