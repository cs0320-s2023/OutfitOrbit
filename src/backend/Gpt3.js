import { Configuration, OpenAIApi } from "openai";
import OPEN_API_KEY from "./private/token.tsx";
import fetch from 'node-fetch';

const configuration = new Configuration({
  apiKey: OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function Gpt3 (word1) {
  const response = await fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "MyCustomUserAgent",
      "Authorization": `Bearer ${OPEN_API_KEY}`
    },
    body: JSON.stringify({
      prompt:
        "Make an outfit from the follow items with this description " + word1 +" and return an object in the same of a" 
        +"list of objects with fields brand, color, material, occassion and type and only return this object to me",
      max_tokens: 3500,
    }),
  });

  const json = await response.json();
  const text = json.choices[0].text;
  const matches = text.match(/\[[^\]]+\]/);
  const result = matches ? matches[0] : "";
  console.log(result);
  return result;
}
