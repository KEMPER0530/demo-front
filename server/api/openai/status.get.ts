import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const apiUrl = (process.env.CHAT_GPT_API_URL || config.public.chatGptApiUrl || '').trim();
  const apiKey = (process.env.CHATGPT_API_KEY || config.public.chatGptApiKey || '').trim();
  const model = (process.env.CHAT_GPT_MODEL || config.public.chatGptModel || '').trim();

  if (!apiUrl || !apiKey || !model) {
    return {
      available: false,
    };
  }

  try {
    const requestBody = JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: 'health check',
        },
      ],
    });

    const { stdout } = await execFileAsync(
      'curl',
      [
        '--silent',
        '--show-error',
        '--location',
        '--request',
        'POST',
        '--output',
        '/dev/null',
        '--write-out',
        '%{http_code}',
        '--header',
        'Content-Type: application/json',
        '--header',
        `Authorization: Bearer ${apiKey}`,
        '--data',
        requestBody,
        apiUrl,
      ],
      {
        timeout: 8000,
      },
    );

    const httpStatus = Number(stdout.trim());
    return {
      available: Number.isInteger(httpStatus) && httpStatus >= 200 && httpStatus < 300,
      httpStatus: Number.isInteger(httpStatus) ? httpStatus : null,
    };
  } catch (error) {
    console.error('openai status check failed:', error);
    return {
      available: false,
    };
  }
});
