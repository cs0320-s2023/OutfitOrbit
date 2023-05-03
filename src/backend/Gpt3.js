import { Configuration, OpenAIApi } from "openai";
import OPEN_API_KEY from "./private/token.tsx";

const configuration = new Configuration({
  apiKey: OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function Gpt3 (word1) {
const completion = await openai.createCompletion({
  model: "text-davinci-003",
  prompt:
    "Make an outfit from the follow items with this description " + word1 +" and return an object in the same of a" 
    +"list of objects with fields brand, color, material, occassion and type and only return this object to me",
  max_tokens: 3500,
});
const text = completion.data.choices[0].text;
const matches = text.match(/\[[^\]]+\]/);
const result = matches ? matches[0] : "";
console.log(result);
return result;
}