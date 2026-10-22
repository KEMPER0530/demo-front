import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatRequest } from '../src/services/chat-request.mjs';
import { compileTemplate, parse } from '@vue/compiler-sfc';
import { renderToString } from 'vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { readFileSync } from 'node:fs';

test('proxy requests use the signed-in session and reject unsafe destinations', () => {
  assert.deepEqual(createChatRequest('https://proxy.example/chat', 'session-token'), {
    url: 'https://proxy.example/chat', authorization: 'Bearer session-token',
  });
  for (const url of ['http://proxy.example/chat', 'https://api.openai.com/v1/chat/completions', 'https://user:pass@proxy.example/chat']) {
    assert.throws(() => createChatRequest(url, 'session-token'));
  }
  assert.throws(() => createChatRequest('https://proxy.example/chat'));
});

test('chat template treats user and model HTML as text', async () => {
  const source = readFileSync(new URL('../src/components/gpt/Chatform.vue', import.meta.url), 'utf8');
  const { descriptor } = parse(source);
  const { code, errors } = compileTemplate({ source: descriptor.template.content, filename: 'Chatform.vue', id: 'chat' });
  assert.deepEqual(errors, []);
  const { render } = await import(`data:text/javascript;base64,${Buffer.from(code.replace('from "vue"', `from ${JSON.stringify(import.meta.resolve('vue'))}`)).toString('base64')}`);
  const payload = '<img src=x onerror=alert(document.cookie)>';
  const app = createSSRApp({ render, setup: () => ({ results: [{ text: payload, role: 'ai', date: '' }, { text: payload, role: 'user', date: '' }], serviceErrorMessage: '', modelName: '', inputText: '', isLoading: false, isInputValid: false }) });
  app.component('NuxtLink', { render: () => h('a') });
  app.component('DashboardBackLink', { render: () => h('a') });
  const html = await renderToString(app);
  assert.ok(!html.includes('<img'));
  assert.equal((html.match(/&lt;img/g) || []).length, 2);
});
