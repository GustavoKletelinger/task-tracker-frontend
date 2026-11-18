import { ApiRequestError } from '@/lib/api'

export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiRequestError) {
    return [err.message, ...err.details].join(' ')
  }
  return fallback
}