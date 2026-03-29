import axios from 'axios'

type ApiErrorPayload =
  | string
  | {
      detail?: string
      message?: string
    }

export function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const payload = error.response?.data

    if (typeof payload === 'string' && payload.trim()) {
      return payload
    }

    if (
      payload &&
      typeof payload === 'object' &&
      'detail' in payload &&
      typeof payload.detail === 'string' &&
      payload.detail.trim()
    ) {
      return payload.detail
    }

    if (
      payload &&
      typeof payload === 'object' &&
      'message' in payload &&
      typeof payload.message === 'string' &&
      payload.message.trim()
    ) {
      return payload.message
    }

    if (error.message.trim()) {
      return error.message
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallbackMessage
}
