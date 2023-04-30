import React, { useEffect, useState }from 'react';
import ReactDOM from 'react-dom';
import jwt_decode from "jwt-decode";
import './Navbar.css'
import CLIENT_ID from '../private/auth.tsx';
import { signInWithGoogle } from '../../backend/firebase.js'

/* Global google */

function Navbar( props ) {
    const [currentUser, setCurrentUser] = useState({}); // TODO: change for firebase database
    const navElem = document.getElementsByClassName("navbar");
    const navbarLinks = document.getElementsByClassName("navbar-links");
    const navbarLinksList = document.getElementsByTagName("li")

    let scrolledOnce = false;

    // listen for scrolling events
    window.addEventListener("scroll", animateNavbar);

    function handleAuthRes(res) {
      let userObject = jwt_decode(res.credential);
      console.log(userObject);
      setCurrentUser(userObject); // sets the current user state to the user signed in
      document.getElementById("signInDiv").hidden = true;
    }

    function handleSignOut() {
      console.log("signing out")
      setCurrentUser({});
      document.getElementById("signInDiv").hidden = false;
    }

    useEffect(() => {
      /* global google */
      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleAuthRes,
      });

      google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        {theme: 'outline', size: 'medium'}
      );
      google.accounts.id.prompt();
    }, []);

    function animateNavbar() {

        let scrollPos = document.documentElement.scrollTop || document.body.scrollTop;

        if (scrollPos == 0 && scrolledOnce == true) {
            scrolledOnce = false;
            navElem[0].style.animation = "navbarChangeBackgroundBack 0.2s linear 1 forwards"
            for (let i = 0; i < navbarLinksList.length; i++) {
                navbarLinksList[i].style.animation = "shiftNavbarBack 0.2s linear 1 forwards"
            }

        } else if (scrollPos >= 35) {
            scrolledOnce = true;
            navElem[0].style.animation = "navbarChangeBackground 0.2s linear 1 forwards"
            for (let i = 0; i < navbarLinksList.length; i++) {
                navbarLinksList[i].style.animation = "shiftNavbar 0.2s linear 1 forwards"
            }
        } 
    }

    function popUpInstructions() {
        props.setInstructionsVisibility(true);
    }

    function popUpAbout() {
        props.setAboutVisibility(true);
    }

    function smoothScroll(id) {
        document.getElementById(id).scrollIntoView({behavior: "smooth"});
    }

    return (
      <nav className="navbar">
        <div id="navbar" className="brand-title">
          Outfit Orbit
        </div>
        <a
          className="toggle-button"
          onClick={() => {
            navbarLinks[0].classList.toggle("active");
          }}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </a>
        <div className="navbar-links">
          <ul className="navbar-links-list">
            {/* <li><a onClick={smoothScroll("navbar")}>Home</a></li> */}
            <li>
              <a onClick={popUpInstructions}>Instructions</a>
            </li>
            <li>
              <a onClick={popUpAbout}>About</a>
            </li>
            {Object.keys(currentUser).length == 0 && // if not signed in currently
              <li>
                {/* <a><button id="signOutButton" onClick={(e) => handleSignOut()}>Sign Out</button></a> */}
                <a><button id="signInButton" onClick={signInWithGoogle}>Sign in</button></a>
              </li>
            }
            <div id='signInDiv'>
            </div> 
          </ul>
        </div>
      </nav>
    );
}

export default Navbar