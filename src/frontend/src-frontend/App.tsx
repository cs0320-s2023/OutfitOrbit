import Navbar from '../Components/Navbar';
import Main from "/Users/Taleena/Desktop/cs32/OutfitOrbit/src/backend/Main.js"
import { useState } from 'react';
import Popup from '../Components/Popup'
import "./App.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGcexpIxc-TsCz_XHeMO6tBAEUzRO0MbU",
  authDomain: "outfitorbit.firebaseapp.com",
  projectId: "outfitorbit",
  storageBucket: "outfitorbit.appspot.com",
  messagingSenderId: "826449206136",
  appId: "1:826449206136:web:e069a08e04f1f4c563868d",
  measurementId: "G-9BXSQBE0QQ",
  databaseURL: "https://outfit-orbit-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

function App() {

  const [instructionsVisibility, setInstructionsVisibility] = useState(false);
  const [aboutVisibility, setAboutVisibility] = useState(false);

  const backgroundImg = require("/Users/javier/IdeaProjects/CSCI0320/OutfitOrbit/src/frontend/media/homepage_background_2.png");
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

    return (
      <div className="grid-container">
        <div className="navbar-container">
          <Navbar
            setInstructionsVisibility={setInstructionsVisibility}
            setAboutVisibility={setAboutVisibility}
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
                  {" "}
                  We are Outfit Orbit. Comitted to helping the environment by
                  taking your outfits to the next level.
                </h2>
              </div>
            </div>
          </Popup>
        </div>
        <div className="generator-container">
          <Main></Main>
        </div>
      </div>
    );
}
export default App;
