/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_NETWORK_TIMEOUT: string
  readonly VITE_DISCOVERY_TIMEOUT: string
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_COMPRESSION_QUALITY: string
  readonly VITE_SUPPORTED_FORMATS: string
  readonly VITE_DEBUG: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_PWA_CACHE_NAME: string
  readonly VITE_PWA_UPDATE_CHECK_INTERVAL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}