import React, { useEffect, useState } from 'react'
import { useWindowSize } from './helpers/functional/windowHook'
// import axios from 'axios'

// import {setter, getter} from './helpers/RedisHelper'
// import {getCookie, renew, c_names, verify} from './helpers/Cookie'
// import PrivateRoute from './helpers/PrivateRoute'

import {AuthProvider, AuthContext, useAuth} from './context/AuthContext'
import _5050 from './components/error_boundaries/_5050'
import _404 from './components/error_boundaries/_404'
import Dashboard from './components/d-vis/Dashboard'
import Header from './components/Header'

import Landing from './components/Landing'
import MainsChart from './components/mains/MainsChart'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom'

import MainsAuth from './components/mains/MainsAuth'
// import MainsProfile from './components/mains/MainsProfile'  
// import useWindowSize from './helpers/functional/windowHook' // Will probably need this elsewhere

import './styles/index.css'


/**
 * ~~ LOG ~~
 * Authentication state is composed by the useAuthState() function. -- Verify this...
 * Authorization for each authenticated request uses Cookies and Redis
 * and will invalidate the Auth State during a mismatch.
 * 
 * TODO Axios//CSRF, √ VALIDATORS, √ SANITIZERS 
 * 
 * TODO AUTHENTICATION
 * √ Logout
 * √ Sync sessions in Mongo
 * ≈Make sure cookies have correct production header
 * 
 * TODO LOCALE
 * Signup Form -> Get location
 * 
 * TODO FAULT TOLERANCE
 * If Redis catches fire the app still needs to work:
 * Default to using Mongo as a session driver.
 * 
 * TODO ERROR ROUTING
 * How will this effect the state of components or the whole app?
 * 
 * TODO ROUTING
 * Preserve page once a user logs in. Use History
 * 
 * TODO Map Options Menu - See components/d-vis/MapTwo.js comments
 * 
 * TODO Collect all outbound API requests into 1 file, or keep them documented and highly visible
 * Locations -> [USA.jsx, MapDataContext.js, Login.js, SignUp.js]
 */


/**
 * This component is for Debug only.
 * Litter it throughout your render methods
 * to guage performance bases on what re-renders
 * @param {*} props 
 */
export function Log(props) {
    
    // console.log(`rendering "${props.name}"`)
    if (props.name == "USA")
        console.log("=====================================================")
    return null
}

function Home() {

    const [error, setError] = useState(0)

    useEffect( () => {
        if (!window.sessionStorage) {
            // setError(1)
        } else {

            // Celebrate
            if (sessionStorage.getItem('occ_recent') == null) {
                sessionStorage.setItem('occ_recent', JSON.stringify({recent: []}))
            }
            if (sessionStorage.getItem('loc_recent') == null) {
                sessionStorage.setItem('loc_recent', JSON.stringify({recent: []}))
            }

        }

        // Explicit backwards navigation 
        window.addEventListener('popstate', (e) => {
            window.location = document.location
        });

        return function(){
            sessionStorage.clear()
            // window.removeEventListener('popstate')
        }
    }, [])

    return  (
        <>
            <Router>

                {error == 1 ? 
                    <>
                        <_5050 />
                    </>
                : 
                    <Switch>

                        <Route exact path="/">
                            <Landing >
                                
                            </Landing>
                        </Route>

                        <Route exact path="/dashboard">
                            <Header />
                            <Dashboard />
                        </Route>
                        
                        <Route path="/map">
                            <MainsChart />
                        </Route>
                        
                        <Route path="/auth">
                            <MainsAuth />
                        </Route>

                        {/* Ye olde 404 */}
                        <Route>
                            <_404 />
                        </Route>

                    </Switch>
                }

            </Router>
        </>
    )
}

export function setWindowSize(windowSize) {

    localStorage.removeItem("mobile")

    /**
     * true and false, when sent to localStorage,
     * turn into literal strings "true" and "false".
     * 
     * TODO Deprecate this nonsense
     */

    if (windowSize.width <= 768) {
        localStorage.setItem('mobile', "true")
    } else {
        localStorage.setItem('mobile', "false")
    }

}

function App() {

    const windowSize = useWindowSize()

    useEffect( () => {
        setWindowSize(windowSize)
    }, [windowSize])
    
    return (

            <AuthProvider>

                <>

                    {/* <Log name="AppComponent" /> */}

                    <Home />

                </>

            </AuthProvider>

    );
}

export default App;