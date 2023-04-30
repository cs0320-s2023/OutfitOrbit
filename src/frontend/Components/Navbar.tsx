import React, { useEffect, useState }from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import './Navbar.css'
import CLIENT_ID from '../private/auth';
import { OAuth2Client } from "google-auth-library";

/* Global google */

function Navbar( props : any ) {
  const [currentUser, setCurrentUser] = useState({}); // TODO: change for firebase database
  const navElem = document.getElementsByClassName("navbar");
  const navbarLinks = document.getElementsByClassName("navbar-links");
  const navbarLinksList = document.getElementsByTagName("li");

  let scrolledOnce = false;

  // listen for scrolling events
  window.addEventListener("scroll", animateNavbar);

  function handleAuthRes(res) {
    let userObject = jwt_decode(res.credentials);
    console.log(userObject);
    setCurrentUser(userObject); // sets the current user state to the user signed in
    document.getElementById("signInDiv").hidden = true;
  }

  function handleSignOut() {
    setCurrentUser({});
    const signInDiv = document.getElementById("signInDiv");
    if (signInDiv) {
      signInDiv.hidden = false;
    }
  }

  // useEffect(() => {
  //   // let script = document.createElement("script");
  //   // script.src = "https://apis.google.com/js/platform.js";
  //   // script.onload = () => {
  //   //   google.accounts.id.initialize({
  //   //     client_id: CLIENT_ID,
  //   //     callback: handleAuthRes,
  //   //   });

  //   //   google.accounts.id.renderButton(document.getElementById("signInDiv"), {
  //   //     theme: "outline",
  //   //     size: "Large",
  //   //   });
  //   // };
  //   // document.body.appendChild(script);
  //   /* global google */
  //   google.accounts.id.initialize({
  //     client_id: CLIENT_ID,
  //     callback: handleAuthRes,
  //   });

  //   google.accounts.id.renderButton(document.getElementById("signInDiv"), {
  //     theme: "outline",
  //     size: "Large",
  //   });
  // }, []);

  function animateNavbar() {
    let scrollPos =
      document.documentElement.scrollTop || document.body.scrollTop;

    if (scrollPos == 0 && scrolledOnce == true) {
      scrolledOnce = false;
      if (navElem[0] instanceof HTMLElement) {
        navElem[0].style.animation =
          "navbarChangeBackgroundBack 0.2s linear 1 forwards";
      }
      for (let i = 0; i < navbarLinksList.length; i++) {
        navbarLinksList[i].style.animation =
          "shiftNavbarBack 0.2s linear 1 forwards";
      }
    } else if (scrollPos >= 35) {
      scrolledOnce = true;
      if (navElem[0] instanceof HTMLElement) {
        navElem[0].style.animation =
          "navbarChangeBackgroundBack 0.2s linear 1 forwards";
      }
      for (let i = 0; i < navbarLinksList.length; i++) {
        navbarLinksList[i].style.animation =
          "shiftNavbar 0.2s linear 1 forwards";
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
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  }

  function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log("Name: " + profile.getName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  
  return (
    <nav className="navbar">
      <div id="navbar" className="brand-title">
        Outfit Orbit
      </div>
      <a
        className="toggle-button"
        onClick={() => {
          const navbarLinks = document.getElementsByClassName("navbar-links");
          navbarLinks[0].classList.toggle("active");
        }}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </a>
      <div className="navbar-links">
        <ul className="navbar-links-list">
          <li>
            <a onClick={popUpInstructions}>Instructions</a>
          </li>
          <li>
            <a onClick={popUpAbout}>About</a>
          </li>
          <div id="signInDiv">
            <a>
              <button onClick={handleSignOut}>Sign Out</button>
            </a>
          </div>
        </ul>
      </div>
    </nav>
  );
};


export default Navbar; 