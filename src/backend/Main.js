
import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import Gpt3 from "./Gpt3.js"
import './Main.css';

export const TEXT_try_button_accessible_name = "try your sequence";
export const TEXT_number_1_accessible_name = "first number in sequence";
export const TEXT_number_2_accessible_name = "second number in sequence";
export const TEXT_number_3_accessible_name = "third number in sequence";
export const TEXT_try_button_text = "Try it!";

function ControlledInput({ value, setValue, ariaLabel }) {
  return (
    <input className="search" 
      placeholder="Describe the outfit you would like to generate."
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      aria-label={ariaLabel}
    ></input>
  );
}

function OldRound({guess}) {
  const [data, setData] = useState ("");

  console.log("result is" + data)
  return (
    <div className={"guess-round-"} aria-label={"scary story"}>
      <p>{guess}</p>
    </div>
  );
}

function NewRound({addGuess}) {
  const [value0, setValue0] = useState ("");
  return (
    <div className="searchBar">
      <div className="Bar">
        {/* This is a comment within the JSX. Notice that it's a TypeScript comment wrapped in
          braces, so that React knows it should be interpreted as TypeScript */}

        {/* I opted to use this HTML tag; you don't need to. It structures multiple input fields
          into a single unit, which makes it easier for screenreaders to navigate. */}
        <fieldset>
          {/* <legend>Type words to generate your scary story:</legend> */}
          <ControlledInput
            value={value0}
            setValue={setValue0}
            ariaLabel={TEXT_number_1_accessible_name}
          />
        </fieldset>
      </div>

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
      
    </div>
  );
}

export default function Main() {
  const [guess, setGuesses] = useState("");
  const [data, setData] = useState ("");

  return (
    <div className="App">
      <OldRound guess={data} />
      <NewRound
        addGuess={(guess) => {
          Gpt3(guess)?.then((r) => setData(r.data.choices[0].text))
          setGuesses(guess);
        }}
      />
    </div>
  );
}
