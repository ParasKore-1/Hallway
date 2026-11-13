/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical public origin, no trailing slash. See .env.example. */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
