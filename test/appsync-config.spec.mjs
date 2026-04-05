import test from 'node:test';
import assert from 'node:assert/strict';

import appSyncConfig, { createAppSyncConfig } from '../src/services/appsync/appsync-exports.js';

test('createAppSyncConfig maps AppSync environment values', () => {
  const config = createAppSyncConfig({
    AWS_APPSYNC_REIGION: 'ap-northeast-1',
    AWS_APPSYNC_GRAPHQL_ENDPOINT: 'https://example.com/graphql',
    AWS_APPSYNC_AUTHENTICATION_TYPE: 'API_KEY',
    AWS_APPSYNC_APIKEY: 'dummy-key',
  });

  assert.deepEqual(config, {
    aws_project_region: 'ap-northeast-1',
    aws_appsync_graphqlEndpoint: 'https://example.com/graphql',
    aws_appsync_region: 'ap-northeast-1',
    aws_appsync_authenticationType: 'API_KEY',
    aws_appsync_apiKey: 'dummy-key',
  });
});

test('default appSyncConfig exposes stable keys', () => {
  assert.ok('aws_project_region' in appSyncConfig);
  assert.ok('aws_appsync_graphqlEndpoint' in appSyncConfig);
  assert.ok('aws_appsync_region' in appSyncConfig);
  assert.ok('aws_appsync_authenticationType' in appSyncConfig);
  assert.ok('aws_appsync_apiKey' in appSyncConfig);
});
