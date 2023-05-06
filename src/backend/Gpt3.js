import { Configuration, OpenAIApi } from "openai";
import OPEN_API_KEY from "./private/token.tsx";
import { readFromDB} from "./firebase.js";

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

export default async function Gpt3(email, word1) {
  const wardrobe = await readFromDB("wardrobeDB", "email", email); 
  const stringWardrobe = JSON.stringify(wardrobe); 
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Create an outfit using only the following pieces: " + stringWardrobe +  "with the following description: " + word1 + "return an" 
    + "array of an object with the fields material, occasion, color, type, brand and name in that order and in the same format as they were inputted",
    max_tokens: 3500,
  });
  console.log(completion.data.choices[0].text);

  return completion;
}
