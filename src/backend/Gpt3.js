import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  // organization: "org-LQVLH1b61EYKODcqmDTTcwNk",
  // apiKey: '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',
  apiKey: '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'
});

const openai = new OpenAIApi(configuration);

export default async function Gpt3 (word1) {
const completion = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "Create an outfit with the following description " + word1,
  max_tokens: 3500
});
console.log(completion.data.choices[0].text);

return completion
}