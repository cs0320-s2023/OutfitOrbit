/**
 * This class uses a chatGPT API to generate an outfit based on a query inputted by the user.
 */

import { Configuration, OpenAIApi } from "openai";
import OPEN_API_KEY from "./private/token.tsx";
import { readFromDB} from "./firebase.js";

const configuration = new Configuration({
  apiKey: OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function Gpt3(email, word1) {
  //retrieved the wardrobe from the database
  const wardrobe = await readFromDB("wardrobeDB", "email", email); 
  //converts the wardrobe from an array of clothing items to a string
  const stringWardrobe = JSON.stringify(wardrobe); 
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Create an outfit using only the following pieces: " + stringWardrobe +  "with the following description: " + word1 + "return an" 
    + "array with objects with the fields material, occasion, color, type, brand and name in that order and in a JSON format.",
    max_tokens: 3500,
  });
  console.log(completion.data.choices[0].text);

  return completion;
}
