/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL_BACKEND_1: string
  readonly VITE_URL_BACKEND_2: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
