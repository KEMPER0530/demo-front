export const listChatGptResults = `
  query listChatGptResults {
    listChatGptResults {
      items {
        id
        user
        input
        output
        createdat
      }
      nextToken
    }
  }`;
