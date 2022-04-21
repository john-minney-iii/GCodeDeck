import React, { Component } from 'react';
import Navbar from '../components/navbar';

export default class AboutUs extends Component {

constructor(props) {
    super(props);
    this.state = {
        authenticated: this.props.authenticated
    }
  }

  render() {
    return (
      <div>
        <div className="AboutUs">
          <Navbar authenticated={this.props.authenticated} changeView={this.props.changeView} />
        </div>
        <div className='m-5'>
          <div className="main">
              <h1 className='heading'>About Us</h1>
              <p className='text'>
                GCODEdeck is the first conversational online GCODE generation tool.
                Our aim is to create an open-source web application for the purpose of
                making the creation of simple tool paths for CNC Mills and Lathes faster
                and simpler, along with the portability and cost effectiveness that comes with a web application.
              </p>
          </div>
          <div className="row">
            <h3> Meet our developers! </h3>
            <div className="col">
              <div className="card">
                <img className="card-img-top" src="../assets/img/hero-image.webp" alt="Card image cap"></img>
                <div className="card-body">
                  <h5 className="card-title">Shannon Daly</h5>
                  <p className="card-text">a whole shitton of fucking lots of text mate</p>
                </div>
                <div className="card-body">
                  <a href="www.linkedin.com/in/shannon-daly-a0b111237">Linkedin</a>
                </div>
              </div>

            </div>
            <div className="col">
              <div className="card">
                <img className="card-img-top" src="../assets/img/hero-image.webp" alt="Card image cap"></img>
                <div className="card-body">
                  <h5 className="card-title">John Minney III</h5>
                  <p className="card-text">Some text</p>
                </div>
                <div className="card-body">
                  <a href="">Linkedin</a>
                </div>
              </div>

            </div>
            <div className="col">
              <div className="card">
                <img className="card-img-top" src="../assets/img/hero-image.webp" alt="Card image cap"></img>
                <div className="card-body">
                  <h5 className="card-title">Riley Peterson</h5>
                  <p className="card-text">Some text</p>
                </div>
                <div className="card-body">
                  <a href="">Linkedin</a>
                </div>
              </div>

            </div>
            <div className="col">
              <div className="card">
                <img className="card-img-top" src="../assets/img/hero-image.webp" alt="Card image cap"></img>
                <div className="card-body">
                  <h5 className="card-title">Katie Williams</h5>
                  <p className="card-text">Some text</p>
                </div>
                <div className="card-body">
                  <a href="">Linkedin</a>
                </div>
              </div>

            </div>
          </div>
        </div>
    </div>
    );
  }
}
