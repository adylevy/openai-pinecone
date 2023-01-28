import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const MODEL = "text-embedding-ada-002";

export async function createEmbedding(text: string) {
  const embedding = await openai.createEmbedding({
    model: MODEL,
    input: text,
  });

  return embedding.data;
}

export async function getCompletion(text: string) {
  try {
    const response = await openai.createCompletion(
      {
        model: "text-davinci-003",
        prompt: text,
        temperature: 0.1,
        max_tokens: 450,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        best_of: 1,
      },
      {
        timeout: 30000,
      }
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
  return {};
}
