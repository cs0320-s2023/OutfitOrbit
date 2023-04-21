import './About.css';
import Navbar from './Components/Navbar';

function About() {

  return (
    <div className="grid-container">
      <div className="navbar-container">
        <Navbar></Navbar>
      </div>

      <div className="about-container">
        <h1>About Us</h1>
        <p></p>
      </div>

      <div className="instructions-container">
        <h1>Instructions</h1>
        <p></p>
      </div>

    </div>
  );
}
export default About;
