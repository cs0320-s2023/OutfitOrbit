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

  onClose = () => {
    this.setState({ showCard: false });
    deleteFromWardrobe(this.props.id);
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

class Front extends React.Component {
  render() {
    return (
      <div className="front">
        <MainArea name={this.props.name} />
      </div>
    );
  }
}

class Back extends React.Component {
  render() {
    return (
      <div className="back">
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
