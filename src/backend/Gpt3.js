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
    prompt: "Create only one outfit from the following pieces of clothing which are clothing items in a JSON formatted as a string: " + stringWardrobe + 
    ". The outfit must be inspired by the following description: " + word1 + ". Return an" 
    + " array with objects with the fields material, occasion, color, type, brand and name in that order and in a JSON format.",
    max_tokens: 3500,
  });
  console.log(completion.data.choices[0].text);

  return completion;
}
