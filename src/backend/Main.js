/**
 * This is the Main class, that creates the overall layout of the frontend of the program. It codes
 */

import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import Gpt3 from "./Gpt3.js";
import "./Main.css";
import { jsonToClothingArray } from "./Clothing.js"
import { updatePoints } from "./firebase.js";

export const TEXT_try_button_accessible_name = "try typing in your outfit request!";
export const TEXT_like_button_accessible_name = "click this button if you like the outfit!";
export const TEXT_number_1_accessible_name = "first number in sequence";
export const TEXT_number_2_accessible_name = "second number in sequence";
export const TEXT_number_3_accessible_name = "third number in sequence";
export const TEXT_try_button_text = "Try it!";
export const TEXT_like_button_text = "Like <3";

/*
This function creates the input space for the search bar where users can enter outfit descriptions/requests
*/
function ControlledInput({ value, setValue, ariaLabel }) {
  return (
    <input
      className="search"
      placeholder="Describe the outfit you would like to generate."
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      aria-label={ariaLabel}
    ></input>
  );
}

function OldRound({ guess }) {
  // const [data, setData] = useState("");
  // console.log("result is" + data);
  return (
    <div className={"old outfit"} aria-label={"this is where your old outfit will show"}>
      {/* <p>{guess}</p> */}
    </div>
  );
}

/*
This function creates the search bar for users to input outfit descriptions/requests
*/
function NewRound({ addGuess, searchResult }) {
  const [value0, setValue0] = useState("");
  return (
    <div className="searchBar">
      <div className="Bar">
        <fieldset>
          {/* <legend>Type words to generate your personalised outfit</legend> */}
          <ControlledInput
            value={value0}
            setValue={setValue0}
            ariaLabel={TEXT_number_1_accessible_name}
          />
        </fieldset>
      </div>

    {/* This is the try button used to submit the outfit generation request*/}
      <div className="Button">
        <button
          onClick={() => {
            addGuess(value0);
            setValue0("");
          }}
          aria-label={TEXT_try_button_accessible_name}
        >
          {/* The text displayed on the button */}
          {TEXT_try_button_text}
        </button>
      </div>

    {/* This is the like button for users to like generated outfits*/}
      <div className="Like_Button">
        <button
          onClick={() => {
            if (searchResult && searchResult.length > 0) {
              updatePoints(searchResult);
            }
          }}
          aria-label={TEXT_like_button_accessible_name}
        >
          {/* The text displayed on the button */}
          {TEXT_like_button_text}
        </button>
      </div>

    </div>
  );
}

/*
This function creates the frontend elements needed for the main opening screen 
*/
export default function Main(props) {
  const [guess, setGuesses] = useState("");
  // const [data, setData] = useState("");

  return (
    <div className="App">
      <OldRound guess={props.GPTresponse}/>
      <NewRound
        result = {props.searchResult}
        addGuess={(guess) => {
          Gpt3(props.currentUserEmail, guess)?.then((r) =>
            props.setResponse(r.data.choices[0].text)
          );
          setGuesses(guess); 
        }} 
      />
    </div>
  );
}
