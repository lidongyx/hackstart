/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HACKADMIN_API_BASE_URL?: string;
  readonly VITE_SUB2API_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
