import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

export default async function Gpt3 (word1) {
const completion = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "Create an outfit with the follwing description " + word1,
  max_tokens: 3500
});
console.log(completion.data.choices[0].text);

return completion
}