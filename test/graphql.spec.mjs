import test from 'node:test';
import assert from 'node:assert/strict';

import { createChatGptResult, createNuxtMail } from '../src/services/appsync/graphql/mutations.js';
import { listChatGptResults } from '../src/services/appsync/graphql/query.js';

test('createNuxtMail mutation definition is exported', () => {
  assert.match(createNuxtMail, /mutation createNuxtMail/);
  assert.match(createNuxtMail, /createNuxtMail\(body: \$body, from: \$from, subject: \$subject, to: \$to\)/);
  assert.match(createNuxtMail, /response/);
  assert.match(createNuxtMail, /result/);
});

test('createChatGptResult mutation definition is exported', () => {
  assert.match(createChatGptResult, /mutation createChatGptResult/);
  assert.match(createChatGptResult, /createChatGptResult\(user: \$user, input: \$input, output: \$output, createdat: \$createdat\)/);
  assert.match(createChatGptResult, /response/);
  assert.match(createChatGptResult, /result/);
});

test('listChatGptResults query definition is exported', () => {
  assert.match(listChatGptResults, /query listChatGptResults/);
  assert.match(listChatGptResults, /items/);
  assert.match(listChatGptResults, /nextToken/);
});
