/**
 * This is the App class, that contains the main frontend components of the program. This includes the navbar, the 
 * searchbar, the Add To Closet form, and the cards to display clothing items and outfits among other components
 */

import Navbar from "./Components/Navbar";
import Main from "../backend/Main";
import { useState, useEffect } from "react";
import Popup from "./Components/Popup";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { readFromDB } from "../backend/firebase";
import Card from "./Components/FlipCard";
import { Clothing } from "../backend/Clothing";
import { addToWardrobe } from "../backend/firebase";

function App() {
  // About states
  const [instructionsVisibility, setInstructionsVisibility] = useState(false);
  const [aboutVisibility, setAboutVisibility] = useState(false);
  const [addVisibility, setAddVisibility] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");


  // Authentication states
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [wardrobe, setWardrobe] = useState([]);
  const [recommendation, setRecommendation] = useState([]);
  const [GPTresponse, setResponse] = useState(""); 
  const [searchResult, setResult] = useState([]); 

  // images
  const backgroundImg = require("../frontend/media/Artboard 1.png");
  const backgroundImgElem = document.getElementsByTagName("img"); // returns a collection

  // Handling image animation against mouse
  function moveImage(e) {
    const positions = [];

    const x = -(e.pageX + backgroundImgElem[0].offsetLeft) / 50;
    const y = -(e.pageY + backgroundImgElem[0].offsetTop) / 50;
    positions.push({ x, y });
    const averageCount = 10;
    if (positions.length > averageCount) positions.splice(0, 1);

    const current = positions.reduce(
      (acc, e) => {
        acc.x += e.x;
        acc.y += e.y;
        return acc;
      },
      { x: 0, y: 0 }
    );
    current.x /= positions.length;
    current.y /= positions.length;

    backgroundImgElem[0].style.transform = `translateX(${current.x}px) translateY(${current.y}px)`;
  }

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   useState((prevProps) => ({
  //     ...prevProps,
  //     [name]: value,
  //   }));
  // };

  /* Get the wardrobe for the current user */
  async function getWardrobe() {
    if (isSignedIn && localStorage.getItem("wardrobe")) {
      try {
        let userData = await readFromDB(
          "wardrobeDB",
          "email",
          localStorage.getItem("email")
        );
        setCurrentUserEmail(localStorage.getItem("email"));
        return userData;
      } catch (error) {
        console.log(error);
        return null; // or handle the error in some other way
      }
    }
  }

  /*
  This function generates cards to display clothing items when they are added to the wardrobe, or when a new outfit is
  generated
  */
  async function generateCard(userWardrobe, setCards) {
    return new Promise(async (resolve) => {
      if (isSignedIn) {
        // let userWardrobe = await getWardrobe();
        let cards = userWardrobe.map((clothing) => {
          return (
            <Card
              name={clothing.name}
              type={clothing.type}
              color={clothing.color}
              material={clothing.material}
              brand={clothing.brand}
              occasion={clothing.occasion}
            />
          );
        });
        setCards(cards);
      }
      resolve();
    });
  }

  //generates a card for each clothing item when displaying the user's wardrobe
  useEffect(() => {
    const generateCardAsync = async () => {
      let userWardrobe = await getWardrobe();
      await generateCard(userWardrobe, setWardrobe);
    };

    if (isSignedIn || wardrobe !== null) {
      generateCardAsync();
    }
  }, [isSignedIn, wardrobe]);

  //generates a card to display the newly generated outfit
  useEffect(() => {
    const generateCardAsync = async () => {
      let JSONWardrobe = JSON.parse(GPTresponse);
      await generateCard(JSONWardrobe, setRecommendation);
      await compareByName(); 
    };
    generateCardAsync();
  }, [GPTresponse]);

  async function compareByName() {
    const matches = [];
    recommendation.forEach((recommendedItem) => {
      console.log(recommendedItem); 
      const match = wardrobe.find((wardrobeItem) => {
        return (
          recommendedItem.props.name.toLowerCase() === wardrobeItem.props.name.toLowerCase());
      });

      if (match) {
        matches.push(match.props);
      }
    });
    console.log(matches); 
    setResult(matches);
  }

  /*
  This function creates a Cllthing object using the field entered by the user, and then passes this object into the 
  addToWardrobe function to add to the user's wardrobe in the firestore database
  */
  function handleSubmit(event) {
      event.preventDefault(); // prevent the form from submitting
    
      // get the values of each input box
      //const name = event.target.elements.name.value;
      const type = event.target.elements.type.value;
      const colour = event.target.elements.colour.value;
      const material = event.target.elements.material.value;
      const occasion = event.target.elements.occasion.value;
      const brand = event.target.elements.brand.value;
      const name = event.target.elements.name.value;
    
      // create a new Clothing item with the fields provided
      const newItem = new Clothing(name, type, colour, material, occasion, brand);
      addToWardrobe(newItem);
  }

  return (
    <div className="grid-container">
      <div className="navbar-container">
        <Navbar
          setInstructionsVisibility={setInstructionsVisibility}
          setAboutVisibility={setAboutVisibility}
          setAddVisibility={setAddVisibility}
          setIsSignedIn={setIsSignedIn}
          isSignedIn={isSignedIn}
        ></Navbar>
      </div>

      <div className="image-container" onMouseMove={(e) => moveImage(e)}>
        <img src={backgroundImg}></img>
        <h1>
          <span className="outfit-title">Outfit</span>{" "}
          <span className="orbit-title">Orbit</span>
        </h1>
        <Popup trigger={instructionsVisibility}>
          <h1 className="instructions-title">Intructions</h1>
          <FontAwesomeIcon
            onClick={() => {
              setInstructionsVisibility(false);
            }}
            icon={faXmark}
            className="x-mark fa-2x"
          />
          <h2 aria-label="Navigate to your digital wardrobe and select the type of outfit you
            would like from the given options!">
            {" "}
            Navigate to your digital wardrobe and select the type of outfit you
            would like from the given options!
          </h2>
        </Popup>
        <Popup trigger={aboutVisibility}>
          <h1 className="instructions-title">About us</h1>
          <FontAwesomeIcon
            onClick={() => {
              setAboutVisibility(false);
            }}
            icon={faXmark}
            className="x-mark fa-2x"
          />
          <div className="row">
            <div className="column">
              <h2 aria-label=" We are Outfit Orbit. Comitted to helping the environment by
                taking your outfits to the next level.">
                We are Outfit Orbit. Comitted to helping the environment by
                taking your outfits to the next level.
              </h2>
            </div>
          </div>
        </Popup>
        <Popup trigger={addVisibility}>
          <h1 className="instructions-title" aria-label="Add Clothing to your Closet!">Add Clothing to your Closet!</h1>
          <FontAwesomeIcon
            onClick={() => {
              setAddVisibility(false);
            }}
            icon={faXmark}
            className="x-mark fa-2x"
          />
          {/* Form used to submit a new clothing item to the user's wardrobe */}
          <div className="row">
            <div className="column">
              <form onSubmit={handleSubmit}>
                <div className="form-control">
                  <label>Name</label> <br />
                  <input
                    type="text"
                    name="name"
                    />
                  </div>
                <div className="form-control">
                  <label>Brand</label> <br />
                  <input
                    type="text"
                    name="brand"
                  />
                </div>
                <div className="form-control">
                  <label>Type</label>
                  <br />
                  <input
                    type="text"
                    name="type"
                  />
                </div>
                <div className="form-control">
                  <label>Colour</label>
                  <br />
                  <input
                    type="text"
                    name="colour"
                  />
                </div>
                <div className="form-control">
                  <label>Material</label>
                  <br />
                  <input
                    type="text"
                    name="material"
                  />
                </div>
                <div className="form-control">
                  <label>Occasion</label>
                  <br />
                  <input
                    type="text"
                    name="occasion"
                  />
                </div>
                <div className="form-control">
                  <br />
                  <label></label>
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </Popup>
      </div>
      <div className="generator-container">
        <Main
          currentUserEmail={currentUserEmail}
          setCurrentUserEmail={setCurrentUserEmail}
          GPTresponse={GPTresponse}
          setResponse={setResponse}
          searchResult={searchResult}
        />
      </div>
      {isSignedIn && GPTresponse && (
        <div>
          <h1 className="wardrobe-title">Your Outfit Selection</h1>
          <div className="wardrobe-container">
            {recommendation.length > 0 ? recommendation
             : "Enter a prompt for a personalized recommendation"}
          </div>
        </div>
      )}

      {!isSignedIn && (
        <div className="wardrobe-container">
          <h1 className="wardrobe-title">
            Please log in to see personalised recommendations
          </h1>
        </div>
      )}
      {/* Conditional rendering, wardrobe only appears when signed in */}
      {isSignedIn ? (
        <div>
          <h1 className="wardrobe-title">
            {isSignedIn
              ? "Your Wardrobe:"
              : "Please log in to see your wardrobe!"}
          </h1>
          <div className="wardrobe-container">
            {wardrobe.length > 0 ? wardrobe : "Loading... Please refresh the page if screen persists"}
          </div>
        </div>
      ) : (
        <div className="wardrobe-container">
          <h1 className="wardrobe-title">
            {" "}
            Please log in to see your wardrobe!
          </h1>
        </div>
      )}
    </div>
  );

}
export default App;
