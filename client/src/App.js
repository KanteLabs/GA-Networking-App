import React, { Component } from 'react';
import axios from 'axios';

import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import DMList from './components/DMList';
import Profile from './components/Profile';
import ProfileForm from './components/ProfileForm';
import ProfileEdit from './components/ProfileEdit';
import Footer from './components/Footer';
import NoMatch from './components/NoMatch';
import MessageForm from './components/MessageForm';
import Events from './components/Events';
import EventList from './components/EventList';
import OtherProfile from './components/OtherProfile';

import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import './App.css';

class App extends Component {
      constructor() {
        super()
        this.state = {
          auth: false,
          user: null,
          currentPage: '/',
          profileFormInfo: null,
          redirect: false,
          recipient: null,
          profileToView: null,
        }
     }

     componentWillUpdate = (prevState, nextState) => {
       if(nextState.redirect){
         this.setState({
           redirect: false,
           currentPage: '/'
         });
          return true;
       }else{
         return false
       }
     }
     
    handleLoginSubmit = (e, username, password) => {
      e.preventDefault();
      axios.post('/auth/login', {
        username,
        password
      }).then(res => {
        this.setState ({
        auth: res.data.auth,
        user: res.data.user,
        currentPage: 'profile',
        redirect: true
        })
      }).catch(err => console.log(err));
    }  

handleRegisterSubmit = (e, username, password, email, firstName, lastName) => {
  e.preventDefault();
  axios.post('/auth/register', {
    username,
    password,
    email,
    firstName,
    lastName
  }).then(res => {
    this.setState ({
      auth: res.data.auth,
      user: res.data.user,
      currentPage: 'profileForm',
      redirect: true
    })
  }).catch(err => console.log(err))
}

handleProfileFormSubmit = (e, age, class_name, cohort, interest, location, bio, pic, user_id) => {
  e.preventDefault();
  axios.post('/profile',{
    age, class_name, cohort, interest, location, bio, pic, user_id
  }).then(res=>{
    this.setState({
      currentPage: 'profile',
      redirect: true
    })
  }).catch(err=>console.log(err))
}
handleRecipient = id => {
  this.setState({
    recipient:id
  });
}
handleProfileToView = id => {
  this.setState({
    profileToView: id
  })
}

logOut = () => {
  axios.get('/auth/logout')
  .then(res => {
    this.setState ({
      auth: false,
      user: null,
      currentPage:'login',
      redirect: true
    })
  }).catch(err => console.log(err))
}

  render() {
    const {redirect} = this.state;
    const {currentPage} = this.state;
    return (
      <Router>
        <div className="App">
          <Header logOut={this.logOut} authState={this.state.auth}/>
          <main className="mdl-layout__content">
              <div className="page-content">
                  {redirect ? (<Redirect to={`/${currentPage}`}/>) : null}
                  <Switch>
                      <Route exact path='/' component={Home} />
                      <Route exact path="/login" render={() => <Login submit={this.handleLoginSubmit} />} />
                      <Route exact path="/register" render={() => <Register submit={this.handleRegisterSubmit} />} />
                      <Route exact path="/feed" render={() => <Feed authState={this.state.auth} user={this.state.user} recipient={this.handleRecipient} data={this.state.user} profileToView={this.handleProfileToView} />} />
                      <Route exact path="/profile" render={() => <Profile authState={this.state.auth} data={this.state.user}/>} />
                      <Route exact path="/profile/edit" render={() => <ProfileEdit data={this.state.user} submit={this.handleProfileFormSubmit}/>} />
                      <Route exact path="/profileForm" render={() => <ProfileForm data={this.state.user} submit={this.handleProfileFormSubmit}/>}/>
                      <Route exact path="/inbox" render={() => <DMList authState={this.state.auth} data={this.state.user} />} />
                      <Route exact path="/sendMessage" render={()=> <MessageForm authState={this.state.auth} sender={this.state.user} recipient={this.state.recipient}/> } />
                      <Route exact path="/events" render={()=> <Events authState={this.state.auth} data={this.state.user}/>} /> 
                      <Route exact path="/myeventlist" render={()=> <EventList authState={this.state.auth} user={this.state.user}/>}/>
                      <Route exact path="/profile/meet" render={()=> <OtherProfile authState={this.state.auth} data={this.state.user} profileToView={this.state.profileToView}/>}/>
                      <Route component={NoMatch} />
                  </Switch>
              </div>
          </main>
        </div>
      </Router>
    )
  }
}

export default App;