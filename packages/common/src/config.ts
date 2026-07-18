export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || `http://localhost:3001`
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || `ws://localhost:8080`

export function getBackendUrl(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BACKEND_URL || BACKEND_URL;
  }
  return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || BACKEND_URL;
}

export function getWsUrl(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_WS_URL || WS_URL;
  }
  return process.env.WS_URL || process.env.NEXT_PUBLIC_WS_URL || WS_URL;
}
