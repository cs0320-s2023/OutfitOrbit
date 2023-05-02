import React from "react";
import { ReactDOM } from "react";
import "./Card.css";

export default class Card extends React.Component {
    render() {
      return (
        <div className="page-container">
          <BlogCard />
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
          <Front />
          <Back />
        </div>
  
      )
    }
  }
  
  class Front extends React.Component {
    render() {
      return (
        <div className="front">
          <MainArea />
        </div>
      )
    }
  }
  
  class Back extends React.Component {
    render() {
      return (
        <div className="back">
          <p>Some sample text to demonstrate how these cards will work, including how they truncate long sentences. This section displays the full-length blog post.</p>
          <p>Bloggity bloggity bloggity blog. This would be the full text of the abbreviated blog post.</p>
        </div>
      )
    }
  }
  
  class MainArea extends React.Component {
    render() {
      return (
        <div className="main-area">
          <div className="blog-post">
            <p className="blog-content">
              Some sample text to demonstrate how these cards will work, including how they truncate long sentences.
              </p>
            <p className="read-more">Hover to read more...</p>
  
          </div>
        </div>
      )
    }
  }