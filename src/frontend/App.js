import Navbar from './Components/Navbar';
import Main from "../backend/Main";
import { useState, useEffect } from 'react';
import Popup from './Components/Popup'
import "./App.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { readFromDB } from '../backend/firebase'
import Card from "./Components/FlipCard"
import { Clothing } from '../backend/Clothing';
import { addToWardrobe } from '../backend/firebase';

function App() {

  // About states
  const [instructionsVisibility, setInstructionsVisibility] = useState(false);
  const [aboutVisibility, setAboutVisibility] = useState(false);
  const [addVisibility, setAddVisibility] = useState(false);

  // Authentication states
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [wardrobe, setWardrobe] = useState([]);

  // images
  const backgroundImg = require("../frontend/media/homepage_background_2.png");
  const backgroundImgElem = document.getElementsByTagName('img'); // returns a collection

  // Handling image animation against mouse
  function moveImage(e) {
    const positions = [];

    const x = -(e.pageX + backgroundImgElem[0].offsetLeft) / 50;
    const y = -(e.pageY + backgroundImgElem[0].offsetTop) / 50;
    positions.push({ x, y });
    const averageCount = 10;
    if (positions.length > averageCount)
      positions.splice(0, 1);
      
    const current = positions.reduce((acc, e) => { acc.x += e.x; acc.y += e.y; return acc }, { x: 0, y: 0 });
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
          let userData = await readFromDB("wardrobeDB", "email", localStorage.getItem("email"));
          return userData;
        } catch (error) {
          console.log(error);
          return null; // or handle the error in some other way
        }
      }
    }
    
    async function generateCard() {
      return new Promise(async (resolve) => {
        if (isSignedIn) {
          let userWardrobe = await getWardrobe();
          let cards = userWardrobe.map((clothing) => {
            console.log(clothing.ocasion)
            console.log(clothing.brand)
            return (
              <Card 
                key={clothing.id}
                name={clothing.name}
                type={clothing.type}
                color={clothing.color}
                material={clothing.material}
                occasion={clothing.occasion}
                brand={clothing.brand}
              />
            );
          });
          setWardrobe(cards);
        }
        resolve();
      });
    }
    
    useEffect(() => {
      const generateCardAsync = async () => {
        console.log("USEFFECT CALLED")
        await generateCard();
      };
      generateCardAsync();
    }, [isSignedIn]);
    


    function handleSubmit(event) {
      event.preventDefault(); // prevent the form from submitting
    
      // get the values of each input box
      const name = event.target.elements.name.value;
      const brand = event.target.elements.brand.value;
      const type = event.target.elements.type.value;
      const colour = event.target.elements.colour.value;
      const material = event.target.elements.material.value;
      const occasion = event.target.elements.occasion.value;
    
      // create a new Clothing item with the fields provided
      // addToWardrobe(new Clothing(type, colour, material, occasion, brand));
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
            <h2>
              {" "}
              Navigate to your digital wardrobe and select the type of outfit
              you would like from the given options!
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
                <h2>
                  We are Outfit Orbit. Comitted to helping the environment by
                  taking your outfits to the next level.
                </h2>
              </div>
            </div>
          </Popup>
          <Popup trigger={addVisibility}>
            <h1 className="instructions-title">Add Clothing to your Closet!</h1>
            <FontAwesomeIcon
              onClick={() => {
                setAddVisibility(false);
              }}
              icon={faXmark}
              className="x-mark fa-2x"
            />
            <div className="row">
              <div className="column">
                <form onSubmit={handleSubmit}>
                  <div className="form-control">
                    <label>Brand</label> <br />
                    <input
                      type="text"
                      name="brand"
                      // value={state.email}
                      // onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-control">
                    <label>Type</label><br />
                    <input
                      type="text"
                      name="type"
                      // value={state.password}
                      // onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-control">
                    <label>Colour</label><br />
                    <input
                      type="text"
                      name="colour"
                      // value={state.password}
                      // onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-control">
                    <label>Material</label><br />
                    <input
                      type="text"
                      name="material"
                      // value={state.password}
                      // onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-control">
                    <label>Occasion</label><br />
                    <input
                      type="text"
                      name="occasion"
                      // value={state.password}
                      // onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-control"><br />
                    <label></label>
                    <button type="submit">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </Popup>
        </div>
        <div className="generator-container">
          <Main></Main>
        </div>
        {/* Conditional rendering, wardrobe only appears when signed in */}
        {isSignedIn ? (
          <div>
            <h1 className="wardrobe-title">
              {isSignedIn ? "Your Wardrobe:" : "Please sign in to see your wardrobe!"}
            </h1>
          <div className="wardrobe-container">
            {wardrobe.length > 0 ? wardrobe : "Loading..."}
            </div>
          </div>
        ): (
          <div className="wardrobe-container">
            <h1 className="wardrobe-title"> Please sign in to see your wardrobe!</h1>
          </div>
        )
        }
      </div>
    );
};
export default App;