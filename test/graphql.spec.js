import { createChatGptResult, createNuxtMail } from '@/src/graphql/mutations'
import { listChatGptResults } from '@/src/graphql/query'

describe('graphql definitions', () => {
  test('exports createNuxtMail mutation', () => {
    expect(createNuxtMail).toContain('mutation createNuxtMail')
    expect(createNuxtMail).toContain('createNuxtMail(body: $body, from: $from, subject: $subject, to: $to)')
    expect(createNuxtMail).toContain('response')
    expect(createNuxtMail).toContain('result')
  })

  test('exports createChatGptResult mutation', () => {
    expect(createChatGptResult).toContain('mutation createChatGptResult')
    expect(createChatGptResult).toContain(
      'createChatGptResult(user: $user, input: $input, output: $output, createdat: $createdat)'
    )
    expect(createChatGptResult).toContain('response')
    expect(createChatGptResult).toContain('result')
  })

  test('exports listChatGptResults query', () => {
    expect(listChatGptResults).toContain('query listChatGptResults')
    expect(listChatGptResults).toContain('items')
    expect(listChatGptResults).toContain('nextToken')
  })
})

