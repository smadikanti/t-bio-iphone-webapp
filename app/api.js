// api.js

export async function callOpenAPI(vibe, localTranscript) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vibe, localTranscript }),
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error; // Rethrow the error for further handling
    }
  }
  