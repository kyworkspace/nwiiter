import React, { useState } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Navigation from 'components/Navigation';
import Profile from 'routes/Profile';
import { Redirect } from 'react-router-dom';

const AppRouter = ({ isLoggedIn,userObj,refreshUser,setUserObj }) => {


    
    return (
        <Router>
            {isLoggedIn && <Navigation  userObj={userObj} />}
            <Switch>
                {isLoggedIn ?
                    <>
                        <Route exact path="/">
                            <Home userObj={userObj}/>
                        </Route>
                        <Route exact path="/profile">
                            <Profile userObj={userObj} refreshUser={refreshUser} setUserObj={setUserObj}/>
                        </Route>

                    </>
                    :
                    <>
                        <Route exact path="/">
                            <Auth />
                        </Route>
                    </>
                }
            </Switch>
        </Router>
    )
}

export default AppRouter