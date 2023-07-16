export const createNuxtMail = `
  mutation createNuxtMail(
    $from: String,
    $to: String,
    $subject: String,
    $body: String,
    $createdat: String
  ) {
    createNuxtMail(body: $body, from: $from, subject: $subject, to: $to, createdat: $createdat)
    {
      response
      result
    }
  }`;

export const createChatGptResult = `
  mutation createChatGptResult(
    $user: String,
    $input: String,
    $output: String,
    $createdat: String
  ) {
    createChatGptResult(user: $user, input: $input, output: $output, createdat: $createdat)
    {
      response
      result
    }
  }`;
