/**
 * This class creates a navigation bar elemnt on the frontend of the program. It handles displaying information about the
 * project, how to use the website, and signing in and out of your profile. It also handles adding new items to the 
 * wardrobes of users that have signed in
 */

import React, { useEffect, useState }from 'react';
import ReactDOM from 'react-dom';
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

    /*
    This function calls functions from the firebase.js file to handle signing in a user using their email or Google
    */
    function handleSignIn() {
      if (!props.isSignedIn) {
        signInWithGoogle();
        username = localStorage.getItem('name');
        userEmail = localStorage.getItem('email');
        createWardrobeDB(username, userEmail, undefined);
        props.setIsSignedIn(true);
      } 
    }

    /*
    This function calls functions from the firebase.js file to handle signing out a user using their email or Google
    */
    function handleSignOut() {
      if (props.isSignedIn) {
        signOutGoogle();
        localStorage.setItem("name", "");
        localStorage.setItem("email", "");
        props.setIsSignedIn(false);
      } 
    }

    /*
    This function animates the navigation bar to chnage colour gracefully when it is scrolled in or out of focus
    */
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

    /*
    The following functions handle displaying popups when the appropriate navbar elements are clicked
    */
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
      <nav className="navbar" aria-label='This is the navigation bar. Tab to discover more about us, instructions, or to sign in'>
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
              <a onClick={popUpInstructions} aria-label='Learn how to use the website'>Instructions</a>
            </li>
            <li>
              <a onClick={popUpAbout} aria-label='Learn more about us'>About</a>
            </li>
            <li>
              {props.isSignedIn && <a onClick={popUpAdd} aria-label='Add an item to your closet'>Add To Closet</a>}
            </li>
            <li>
              {props.isSignedIn && (
                <a>
                  <button id="signOutButton" onClick={handleSignOut} aria-label='Sign out'>
                    Sign out
                  </button>
                </a>
              )}
              {!props.isSignedIn && (
                <a>
                  <button id="signInButton" onClick={handleSignIn} aria-label='Sign in'>
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