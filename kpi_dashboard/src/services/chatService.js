import { API_URL } from '../config.js';

const API_BASE_URL = `${API_URL}/api`;

/**
 * Service for chatbot API calls
 * Simple fetch wrapper for the chat endpoint
 */

export const sendChatMessage = async (question, context) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        context: {
          start_date: context.startDate,
          end_date: context.endDate,
          region: context.region,
        }
      }),
    });

    // Handle rate limit
    if (response.status === 429) {
      return {
        success: false,
        data: null,
        error: 'Too many messages. Please wait a minute before trying again.'
      };
    }

    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        data: null,
        error: errorData.detail || `Server error: ${response.status}`
      };
    }

    const data = await response.json();
    return { success: true, data, error: null };

  } catch (error) {
    // Network or other errors
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to send message. Please try again.'
    };
  }
};

export default { sendChatMessage };
