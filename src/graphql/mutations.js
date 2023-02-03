export const createNuxtMail = `
  mutation createNuxtMail(
    $from: String,
    $to: String,
    $subject: String,
    $body: String,
    $createdat: String,
    $updatedat: String
  ) {
    createNuxtMail(body: $body, from: $from, subject: $subject, to: $to,
                           createdat: $createdat, updatedat: $updatedat)
    {
      response
      result
    }
  }`;

export const createChatGpt = `
  mutation createChatGpt(
    $prompt: String
  ) {
    createChatGpt(prompt: $prompt)
    {
      response
      result
    }
  }`;
