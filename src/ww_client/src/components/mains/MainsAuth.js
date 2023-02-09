import React, { useEffect, useContext } from 'react';
import SignUp from '../auth/SignUp.js';
import Login from '../auth/Login.js';
import { AuthContext } from '../../context/AuthContext.js';
import {
    BrowserRouter as Router,
    Redirect,
    Route, 
    Switch,
  } from "react-router-dom";

function MainsAuth () {

    const auth = useContext(AuthContext)

    useEffect(() => {
        console.log("Auth State [MainsAuth] :", auth.authState)
    },[])

    return (
        <div>
            <section className="container">
                <div className="logForm">
                    <Switch>

                        <Route path="/auth/login" component={Login} />
                        
                        <Route path="/auth/signup" component={SignUp} />

                        <Route path="/auth" exact>
                            <Redirect to="/" />
                        </Route>

                    </Switch>
                </div>
            </section>
        </div>
    )    
};

export default MainsAuth;