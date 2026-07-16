/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_RESUME_PARSE_ENDPOINT: string
  readonly VITE_INTERVIEW_ICE_SERVERS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
