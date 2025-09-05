/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  readonly VITE_BACKUP_PATH: string
  readonly VITE_MOCK_DATA: boolean
  readonly VITE_DEBUG_MODE: boolean
  readonly VITE_PWA_NAME: string
  readonly VITE_PWA_SHORT_NAME: string
  readonly VITE_PWA_DESCRIPTION: string
  readonly VITE_ALLOWED_ORIGINS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}