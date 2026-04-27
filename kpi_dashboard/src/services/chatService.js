import { API_BASE_URL } from '../config.js'

const CHAT_REQUEST_TIMEOUT_MS = 25000

const formatChatError = (detail, fallbackStatus) => {
  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || item?.message || item?.detail)
      .filter(Boolean)
      .join(' ')
  }

  if (typeof detail === 'string') {
    return detail
  }

  if (detail && typeof detail === 'object') {
    return detail.message || detail.detail || `Server error: ${fallbackStatus}`
  }

  return `Server error: ${fallbackStatus}`
}

export const sendChatMessage = async (question, context) => {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), CHAT_REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        question,
        context: {
          start_date: context.startDate,
          end_date: context.endDate,
          region: context.region,
        }
      }),
    });

    if (response.status === 429) {
      return {
        success: false,
        data: null,
        error: 'Too many messages. Please wait a minute before trying again.'
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        data: null,
        error: formatChatError(errorData.detail, response.status)
      };
    }

    const data = await response.json();
    return { success: true, data, error: null };

  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        data: null,
        error: 'The chatbot took too long to respond. Please try again.'
      };
    }

    return {
      success: false,
      data: null,
      error: error.message || 'Failed to send message. Please try again.'
    };
  } finally {
    window.clearTimeout(timeoutId)
  }
};
