import { Configuration, OpenAIApi } from "openai";
import OPEN_API_KEY from "./private/token.js";

const configuration = new Configuration({
  apiKey: OPEN_API_KEY,
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