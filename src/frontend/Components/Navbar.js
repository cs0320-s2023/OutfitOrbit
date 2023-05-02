import React, { useEffect, useState }from 'react';
import './Navbar.css'
import { signInWithGoogle, signOutGoogle, createWardrobeDB } from '../../backend/firebase.js'
import { prodErrorMap } from '@firebase/auth';

function Navbar( props ) {
    const navElem = document.getElementsByClassName("navbar");
    const navbarLinks = document.getElementsByClassName("navbar-links");
    const navbarLinksList = document.getElementsByTagName("li")

    let scrolledOnce = false;
    let username;
    let userEmail;

    // listen for scrolling events
    window.addEventListener("scroll", animateNavbar);

    function handleSignIn() {
      if (!props.isSignedIn) {
        signInWithGoogle();
        username = localStorage.getItem('name');
        userEmail = localStorage.getItem('email');
        createWardrobeDB(username, userEmail, undefined);
        props.setIsSignedIn(true);
      } 
    }

    function handleSignOut() {
      if (props.isSignedIn) {
        signOutGoogle();
        localStorage.setItem("name", "");
        localStorage.setItem("email", "");
        props.setIsSignedIn(false);
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

    function popUpAdd() {
      props.setAddVisibility(true); 
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
            <li>
              <a onClick={popUpInstructions}>Instructions</a>
            </li>
            <li>
              <a onClick={popUpAbout}>About</a>
            </li>
            <li>
              {props.isSignedIn && <a onClick={popUpAdd}>Add To Closet</a>}
            </li>
            <li>
              {props.isSignedIn && (
                <a>
                  <button id="signOutButton" onClick={handleSignOut}>
                    Sign out
                  </button>
                </a>
              )}
              {!props.isSignedIn && (
                <a>
                  <button id="signInButton" onClick={handleSignIn}>
                    Sign in
                  </button>
                </a>
              )}
            </li>
          </ul>
        </div>
      </nav>
    );
}

export default Navbar;