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
  prompt:
    "Make an outfit from the following items:\n\nbrand\n\"zara\"\ncolor\n\"red\"\nmaterial\n\"cotton\"\noccassion\n\"casual\"\ntype\n\"shirt\"\n\nbrand\n\"zara\"\ncolor\n\"red\"\nmaterial\n\"cotton\"\noccassion\n\"casual\"\ntype\n\"pants\"\n\nwith this description " + word1 + " and return an object in the form of a list of objects with fields brand, color, material, occassion, and type, and only return this object to me",
  max_tokens: 3500,
});
const text = completion.data.choices[0].text;
const matches = text.match(/\[[^\]]+\]/);
const result = matches ? matches[0] : "";
console.log(result);
return result;
}