export const createNuxtMail = `
  mutation createNuxtMail(
    $from: String,
    $to: String,
    $subject: String,
    $body: String,
    $createdat: String,
    $updatedat: String
  ) {
    createNuxtMail(input: {body: $body, from: $from, subject: $subject, to: $to, createdat: $createdat, updatedat: $updatedat})
    {
      body
      from
      subject
      to
      createdat
      updatedat
    }
  }`;
