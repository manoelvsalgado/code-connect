import axios from 'axios'

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Unexpected error. Please try again.'
  }

  const rawMessage = error.response?.data?.message

  if (Array.isArray(rawMessage) && rawMessage.length > 0) {
    return String(rawMessage[0])
  }

  if (typeof rawMessage === 'string') {
    return rawMessage
  }

  return error.message || 'Request failed'
}
