import React, { Component } from 'react';
import LandingPage from './views/landing_page';
import Community from './views/community';
import AboutUs from './views/about_us';
import GenHome from './views/gen-home';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/app.css';  

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: 'landing-page',
            token: '',
            authenticated: false
        };
    }

    loginUser = (token) => {
        this.setState({
            token: token,
            authenticated: true
        });
    };

    changeCurrentView = (value) => {
        this.setState({ currentView: value});
    };

    chooseCurrentView = () => {
        if (this.state.currentView === 'landing-page')
            return <LandingPage 
                authenticated={this.state.authenticated}
                loginUser={this.loginUser}
                changeView={this.changeCurrentView}
            />
        else if (this.state.currentView === 'about-us')
            return <AboutUs 
                authenticated={this.state.authenticated}
                changeView={this.changeCurrentView} 
            />
        else if (this.state.currentView === 'community')
            return <Community 
                authenticated={this.state.authenticated}
                changeView={this.changeCurrentView}
            />
        else if (this.state.currentView === 'gen-home')
            return <GenHome 
                authenticated={this.state.authenticated}
                changeView={this.changeCurrentView}
            />
        return <p>Idk Dawg</p>
    };

    render() {
        return this.chooseCurrentView();
    }
}
