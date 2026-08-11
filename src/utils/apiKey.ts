export function getByokApiKey(): string {
  try {
    return localStorage.getItem('gemini_byok_api_key') || '';
  } catch {
    return '';
  }
}

export function setByokApiKey(key: string): void {
  try {
    if (key && key.trim().length > 0) {
      localStorage.setItem('gemini_byok_api_key', key.trim());
    } else {
      localStorage.removeItem('gemini_byok_api_key');
    }
  } catch (e) {
    console.error('Failed to save BYOK API key:', e);
  }
}

export function getAuthHeaders(): Record<string, string> {
  const key = getByokApiKey();
  if (key) {
    return { 'X-Gemini-Api-Key': key };
  }
  return {};
}
