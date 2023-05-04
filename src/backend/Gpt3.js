import { Configuration, OpenAIApi } from "openai";
import OPEN_API_KEY from "./private/token.tsx";

const configuration = new Configuration({
  apiKey: OPEN_API_KEY,
  // headers: {
  //   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
  // }
});

const openai = new OpenAIApi(configuration);

export default async function Gpt3 (word1) {
  console.log(openai)
const completion = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "Create an outfit with the following description " + word1,
  max_tokens: 3500
});
console.log(completion.data.choices[0].text);

return completion
}