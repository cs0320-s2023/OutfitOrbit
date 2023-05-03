import React from "react";
import { ReactDOM } from "react";
import "./Card.css";

export default class Card extends React.Component {
    render() {
      return (
        <div className="page-container">
          <BlogCard 
          name={this.props.name}
          color={this.props.color}
          material={this.props.material}
          type={this.props.type} // shirt, trousers etc...
          note={this.props.note}
          />
        </div>
      )
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
    }

    render() {
      return (
        <div onMouseEnter={this.flip} onMouseLeave={this.flip} className={"card-container" + (this.state.flipped ? " flipped" : "")}>
          <Front name={this.props.name}/>
          <Back 
          color={this.props.color}
          material={this.props.material}
          type={this.props.type}
          note={this.props.note}/>
        </div>
  
      )
    }
  }
  
  class Front extends React.Component {
    render() {
      return (
        <div className="front">
          <MainArea name={this.props.name}/>
        </div>
      )
    }
  }
  
  class Back extends React.Component {
    render() {
      return (
        <div className="back">
            <p>Type: {this.props.type}</p>
            <p>Material: {this.props.material}</p>
            <p>Color: {this.props.color}</p>
            <p>Note: {this.props.note}</p>
        </div>
      )
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
      )
    }
  }