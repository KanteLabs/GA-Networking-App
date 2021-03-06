import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import shuffle from 'shuffle-array';

class Feed extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: null,
            dataLoaded: false,
            userInfo: null,
            redirect: false,
            currentPage: 'feed'
        }
    }

    componentDidMount() {
        this.setState({userInfo: this.props.data})
        if (this.props.data !== null) {
            this.setState({redirect: false})
            axios.get('/profile/feed').then(res => {
                let profiles = res.data.filter(profile=>{
                    if(profile.user_id !== this.props.data.id ){
                        return profile;
                    }
                });

                shuffle(profiles);

                this.setState({
                    data: profiles,
                    dataLoaded: true
                });
            }).catch(err=> {console.log(err)});
        }else{
            this.setState({redirect: true})
        }
    }

    sendMessage = id => {
            this.props.recipient(id);
            this.setState({
                redirect:true,
                currentPage: 'sendMessage'
            });
    }
    
    viewProfile = id => {
        this.props.profileToView(id);
        this.setState({
            redirect: true,
            currentPage: `profile/meet`
        });
    }

    handleFilter = (e) =>{
        let filterVal = e.target.value;
         axios.get('/profile/feed').then(res => {
            let filteredProfiles = res.data.filter(profile=>{
                if(profile.user_id !== this.props.data.id && profile.class ===filterVal){
                    return profile
                }
            });
            this.setState({
                data: filteredProfiles,
                dataLoaded: true
            })
        })
        .catch(err=> {console.log(err)});
    }

    restoreSearch = (e) => {
         axios.get('/profile/feed').then(res => {
            let profiles = res.data.filter(profile=>{
                if(profile.user_id !== this.props.data.id ){
                    return profile
                }
            })
            console.log(profiles);
            this.setState({
                data: profiles,
                dataLoaded: true
            })
        }).catch(err=> {console.log(err)});
    }

    renderFeed = () => {
        if (this.state.dataLoaded) {
            return (
              <ul className='feed'>  
                {this.state.redirect ?(<Redirect to={`/${this.state.currentPage}`} />) : null}   
                {this.state.data.map((profile, i) => {
                    return (
                    <div className="profile-card-square mdl-card mdl-shadow--8dp" key={i}>
                        <div className="mdl-card__title mdl-card--expand" style={{background: `url(${profile.picture_url}) center / cover no-repeat`}}>
                            <h2 className="mdl-card__title-text profileName">
                                {profile.first_name} &nbsp;{profile.last_name}
                            </h2>
                        </div>
                        <div className="mdl-card__supporting-text">
                            <h4>About {profile.first_name} </h4>
                            <h4>Bio:</h4> {profile.bio}
                            <ul>
                                <li> <p>Age: {profile.age}</p> </li>
                                <li> <p>Location: {profile.location}</p> </li>
                                <li> <p>Class: {profile.class}</p> </li>
                                <li> <p>Cohort: {profile.cohort}</p> </li>
                                <li> <p>Interests: {profile.interest}</p> </li>
                            </ul>
                        </div>
                        <div className="mdl-card__actions mdl-card--border">
                        <button onClick={(()=>this.sendMessage(profile.user_id))} className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Send Message</button>
                        <button onClick={(()=>this.viewProfile(profile.user_id))} className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">View Profile</button>
                        </div>
                    </div>
                    )
                })}
            </ul>
            )
        } else {
            return <div id="p2" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
        }
    }

    render(){
        const {redirect} = this.state;
        return(
           <div> 
            <h1 className="pageTitle">Feed</h1>
            <div className='class-filter'>
                <input onClick={(e)=>this.handleFilter(e)} type='radio' name='class' value='WDI'/> WDI <br/>
                <input onClick={(e)=>this.handleFilter(e)} type='radio' name='class' value='UXDI'/> UXDI <br/>
                <input onClick={(e)=>this.handleFilter(e)} type='radio' name='class' value='DSI'/> DSI <br/>
                <input onClick={(e)=>this.restoreSearch(e)} type='radio' name='class' value='All'/> All <br/>
            </div>    
            {redirect ?(<Redirect to='/profile'/>) : null}
            {this.renderFeed()}
           </div> 
        )
    }
}

export default Feed;
