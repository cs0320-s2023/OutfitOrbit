import React, { useEffect, useState }from 'react';
import ReactDOM from 'react-dom';
import jwt_decode from "jwt-decode";
import './Navbar.css'
import CLIENT_ID from '../private/auth.tsx';
import { signInWithGoogle, signOutGoogle, createWardrobeDB } from '../../backend/firebase.js'

function Navbar( props ) {
    const [currentUser, setCurrentUser] = useState({}); // TODO: change for firebase database
    const [isSignedIn, setSignedIn] = useState(false);
    const navElem = document.getElementsByClassName("navbar");
    const navbarLinks = document.getElementsByClassName("navbar-links");
    const navbarLinksList = document.getElementsByTagName("li")

    let scrolledOnce = false;
    let username;
    let userEmail;

    // listen for scrolling events
    window.addEventListener("scroll", animateNavbar);

    function handleSignIn() {
      if (!isSignedIn) {
        signInWithGoogle();
        username = localStorage.getItem('name');
        userEmail = localStorage.getItem('email');
        createWardrobeDB(username, userEmail, undefined);
        setSignedIn(true);
      } 
    }

    function handleSignOut() {
      if (isSignedIn) {
        signOutGoogle();
        localStorage.setItem("name", "");
        localStorage.setItem("email", "");
        setSignedIn(false);
      } 
    }

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
              <li>
                {isSignedIn &&
                  <a><button id="signOutButton" onClick={handleSignOut}>Sign out</button></a>
                }
                {!isSignedIn &&
                  <a><button id="signInButton" onClick={handleSignIn}>Sign in</button></a>
                }
              </li>
          </ul>
        </div>
      </nav>
    );
}

export default Navbar