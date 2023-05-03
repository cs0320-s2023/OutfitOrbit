import Navbar from './Components/Navbar';
import Main from "../backend/Main";
import { useState } from 'react';
import Popup from './Components/Popup'
import "./App.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { readFromDB } from '../backend/firebase'
import Card from "./Components/FlipCard"

function App() {

  // About states
  const [instructionsVisibility, setInstructionsVisibility] = useState(false);
  const [aboutVisibility, setAboutVisibility] = useState(false);
  const [addVisibility, setAddVisibility] = useState(false);

  // Authentication states
  const [currentUser, setCurrentUser] = useState({});
  const [isSignedIn, setIsSignedIn] = useState(false);

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

    const handleSubmit = (event) => {
      event.preventDefault();
    };

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
                <h2>
                  Using the form below, add an article of clothing from your
                  closet into your own virtual wardrobe!
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-control">
                    <label>Email</label>
                    <input
                      type="text"
                      name="email"
                      // value={state.email}
                      // onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-control">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      // value={state.password}
                      // onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-control">
                    <label></label>
                    <button type="submit">Login</button>
                  </div>
                </form>
              </div>
            </div>
          </Popup>
        </div>
        <div className="generator-container">
          <Main></Main>
        </div>
        {isSignedIn ? (
          <div className="wardrobe-container">
            <Card name="Red Dress"></Card>
          </div>
        ): <div></div>
        }
      </div>
    );
};
export default App;