export async function callAi(request) {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: request.prompt,
        responseType: request.responseType ?? 'text',
        fallback: request.fallback
      })
    });

    if (!res.ok) {
      throw new Error('AI request failed');
    }

    const payload = await res.json();
    return payload.payload;
  } catch (error) {
    return request.fallback;
  }
}