// The upstream API key belongs exclusively to an authenticated backend proxy.
export function createChatRequest(proxyUrl, idToken) {
  const url = new URL(proxyUrl);
  if (url.protocol !== 'https:' || url.username || url.password || url.hostname === 'api.openai.com') {
    throw new Error('Configure an HTTPS authenticated chat proxy.');
  }
  if (!idToken) {
    throw new Error('Sign in before sending a chat request.');
  }
  return { url: url.href, authorization: `Bearer ${idToken}` };
}
