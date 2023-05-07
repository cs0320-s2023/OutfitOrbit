/**
 * This is the FlipCard class, that models the card used to display generated outfits and clothing items in a user's 
 * wardrobe. It displays the name of the outfit or clothing item on the front, and the properties of that outfit or clothing
 * item in the back.
 */

import React from "react";
import { ReactDOM } from "react";
import "./FlipCard.css";
import { deleteFromWardrobe } from "../../backend/firebase";

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCard: true,
    };
  }

  //makes the card invsible when 'closed', and deletes the clothing item it corresponds to from the database
  onClose = () => {
    console.log("closed card!")
    this.setState({ showCard: false });
    deleteFromWardrobe(this.props);
  };

  render() {
    return (
      <div className="page-container">
        {this.state.showCard && (
          <BlogCard
            name={this.props.name}
            color={this.props.color}
            material={this.props.material}
            type={this.props.type} // shirt, trousers etc...
            occasion={this.props.occasion}
            brand={this.props.brand}
            onClose={this.onClose}
          />
        )}
      </div>
    );
  }
}

/*
Creates an object that can flip over when hovered over with a mouse. Displays the properties of that item on the back, 
and the name of the item on the front.
*/
class BlogCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flipped: false };
    this.flip = this.flip.bind(this);
  }

  flip = () => {
    this.setState({ flipped: !this.state.flipped });
  };

  render() {
    return (
      <div
        onMouseEnter={this.flip}
        onMouseLeave={this.flip}
        className={"card-container" + (this.state.flipped ? " flipped" : "")}
      >
        <Front name={this.props.name} />
        <Back
          name={this.props.name}
          color={this.props.color}
          material={this.props.material}
          type={this.props.type} // shirt, trousers etc...
          occasion={this.props.occasion}
          brand={this.props.brand}
          onClose={this.props.onClose}
        />
      </div>
    );
  }
}

/*
This function models the front of the card
*/
class Front extends React.Component {
  render() {
    return (
      <div className="front" aria-label={"This is the front of a card"}>
        <MainArea name={this.props.name} />
      </div>
    );
  }
}

/*
This function models the back of the card
*/
class Back extends React.Component {
  render() {
    return (
      <div className="back" aria-label={"This is the back of a card"}>
        <button onClick={this.props.onClose} className="close-button">
          X
        </button>
        <p>Type: {this.props.type}</p>
        <p>Material: {this.props.material}</p>
        <p>Color: {this.props.color}</p>
        <p>Occasion: {this.props.occasion}</p>
        <p>Brand: {this.props.brand}</p>
      </div>
    );
  }
}

/*
This function is used to model the inner element o fteh front of the cars
*/
class MainArea extends React.Component {
  render() {
    return (
      <div className="main-area">
        <div className="blog-post">
          {/* display the name of the card */}
          <h1 className="cloth-title">{this.props.name}</h1>
        </div>
      </div>
    );
  }
}
