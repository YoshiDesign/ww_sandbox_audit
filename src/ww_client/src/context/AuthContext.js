import React, {useEffect, useReducer} from 'react'
import {c_names, getCookie, verify, renew} from '../helpers/Cookie'
const CSRF=""
const SESSION_COOKIE = c_names.SESSION_COOKIE
const AUTH_COOKIE = c_names.AUTH_COOKIE

// A custom hook for our current Auth State
export function useAuth() {
    const state = React.useContext(AuthContext)

    console.log("USE AUTH STATE:\n", state)
    return {
        ...state,
    }
}

// The reducer function for managing Global authState
const authReducer = (state, action) => {

    switch(action.type) {
        case "login" :
            console.log("AuthReducer ... login")
            return {...state, user: action.user, isLoggedIn: true, status:'done', csrf:action.token}
        case "logout" : 
            console.log("AuthReducer ... logout")
            return {...state, isLoggedIn: false, status:'done', user: null, csrf: null}
        case "check" : 
            console.log("AuthReducer ... check")
            return  {...state}
        case "noAuth" : // Empty
            return {...state, status:'done'}
        case "loading" : 
            return {...state, status:'loading'}
        default :
            return {...state, isLoggedIn: false}
    }

}

export const AuthContext = React.createContext()

/*
 * Auth is currently disabled
 * This is a HOC of a context provider.
 * This equips middleware for session management
 */
export function AuthProvider(props) {

    // Initial Global State fed into Reducer
    const initAuthState = {
        isLoggedIn: false,
        csrf: null, 
        user : null,
        status : 'loading'
    }

    const [authState, authDispatch] = useReducer(authReducer, initAuthState)

    // Persistent Auth Middleware
    useEffect( () => {

        console.log("=!==!= \n=!==!=\nAuth-Use-Effect! \n=!==!=\n=!==!=")

        if (authState.status != "done") {

            /*                  SESSION MANAGEMENT
            * This is effectively middleware for keeping the session authentic.
            * The token is fetched from the browser cookies and sought for
            * in the Redis Cache. If it exists, the authState.user object becomes the Redis
            * key's value, encrypted. If the value decrypts to a parsable 
            * JSON string, we're groovy.
            */ 

            let c;
            // ... If we have the session cookie
            if ((c = getCookie(SESSION_COOKIE))) {

                // console.log("GOT SESSION COOKIE")

                let a;
                // ... and still have the temporary auth cookie
                if (a = getCookie(AUTH_COOKIE)) {
                    // console.log("GOT AUTHENTICATION COOKIE")
                    /*
                     * verify() will send the SESSION_COOKIE
                     * to the server to be validated
                     */ 
                    verify().then( data => {
                        authDispatch({...authState, status:"done", type:'login', user: data.info, token:a})
                    }).catch( err => {
                        console.log("Error verifying cookie")
                        console.log(err)
                    })
                    
                } else {
                    
                    console.log("NO AUTH COOKIE DETECTED. ATTEMPTING TO RENEW...")
                    // Renew the session with a fresh CSRF token
                    renew().then( data => {

                        /**
                         * This if/else only serves to differentiate between a typical refresh
                         * and a wake_up idle user who's cookie & cache have expired
                         */

                        if (data.wake_up)
                            // console.log("---------------------WOKE----------------------")
                        //     setCookie(AUTH_COOKIE, data.token, 15, true)
                        // else
                        //     setCookie(AUTH_COOKIE, data.token, 15, true)

                        authDispatch({...authState, status:"done", type:'login', user: data.info, token:data.token})
                    }).catch( err => { 
                        console.log("ERROR [Renew] ", err)
                    })
                    
                }
                
            } else {
                authDispatch({...authState, status:"done", type:'logout', user: null, token: null})
            }
        } else {
            authDispatch({...authState, status:"done", type:'logout', user: null, token: null})
        }

    }, [])
    
    // console.log("- - -Exec Auth Provider- - -")
    return (
        <AuthContext.Provider value={
            {
                authState: authState.user, // user ? logged_in : null
                authDispatch: authDispatch
            }
        }>

            {props.children}

        </AuthContext.Provider>
    )
}