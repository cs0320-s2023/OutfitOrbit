import React from 'react';
import './Navbar.css'

function Navbar( props ) {
    const navElem = document.getElementsByClassName("navbar");
    const navbarLinks = document.getElementsByClassName("navbar-links");
    const navbarLinksList = document.getElementsByTagName("li")

    let scrolledOnce = false;

    // listen for scrolling events
    window.addEventListener("scroll", animateNavbar);

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
            <div id="navbar" className="brand-title">Outfit Orbit</div>
                <a  
                    className="toggle-button" 
                    onClick={() => {
                    navbarLinks[0].classList.toggle('active');
                }}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
                </a>
            <div className="navbar-links">
                <ul className="navbar-links-list">
                    {/* <li><a onClick={smoothScroll("navbar")}>Home</a></li> */}
                    <li><a onClick={popUpInstructions}>Instructions</a></li>
                    <li><a onClick={popUpAbout}>About</a></li> 
                </ul>
            </div>
        </nav>
    );
}

export default Navbar