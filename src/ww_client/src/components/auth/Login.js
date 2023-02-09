import React, { useState, useContext } from 'react';
import axios from 'axios'
import { Log } from '../../App';
import { AuthContext } from '../../context/AuthContext';
import {c_names} from '../../helpers/Cookie'
import {
    Redirect
} from 'react-router-dom'

const SESSION_COOKIE = c_names.SESSION_COOKIE
const AUTH_COOKIE = c_names.AUTH_COOKIE

function Login () {
    // Login Form Items
    const authContext = useContext(AuthContext)
    // Redirect if already loggedin
    if (authContext.user) {
        window.location = "/"
    }

    const [form, setForm] = useState({
        email: "",
        password: "",
    })
    const [error, setError] = useState(null)

    const login = (e) => {
        e.preventDefault();

        // TODO? un-common-ify the JS
        document.getElementById('loginSubmit').classList.add('dsub')
        document.getElementById('loginSubmit').setAttribute('disabled', '1')

        console.log("LOGGING IN: ", form)
        axios.post('/auth/login', form, {
            proxy: {
                host: 'localhost',
                port: 4000
            }
        })
        .then( res => {

            if (!res.data.Success) {
                
                document.getElementById('loginSubmit').classList.remove('dsub')
                    setTimeout(function(){
                        document.getElementById('loginSubmit').removeAttribute('disabled')
                    }, 1000)
                setError(res.data.message )
                return 0;
            } else {

                res.data.type = "login"
                authContext.userDispatch(res.data)

                // let success = setCookie(SESSION_COOKIE, res.data.user, 100)
                // let authentic = setCookie(AUTH_COOKIE, res.data.token, 15, true)
                window.location = "/"

            }
        })
        .catch( err => {
            console.log("Auth Error: ", err)
            // setCookie(AUTH_COOKIE, null, -1)
            // setCookie(SESSION_COOKIE, null, -1)
            window.location = "/auth/login"
        });
    };

    return (
        <>
            <Log name="Login" />

            {/* !! 
                TODO:
                Sign-up for the program
            !! */}

            { authContext.user ? 

                <Redirect to="/" />

                :

                <form role="form" aria-label="Log in form" onSubmit={login}>
                    <p>Login Form</p>
                    { error ? <p className="err" >{error}</p> : null}

                    <div className="form-group">
                        <input autoFocus="1" placeholder="Email" aria-label="Email" className="form-control" type="email" name="email" 
                            value={form.email || ""}
                            onChange={ e => setForm( { ...form, email: e.target.value } )} />
                    </div>

                    <div className="form-group">
                        <input placeholder="Password" aria-label="Password" className="form-control" type="password" name="password" 
                            value={form.password || ""}
                            onChange={ e => setForm( { ...form, password: e.target.value } )} />
                    </div>

                    <div className="form-group">
                        <input id="loginSubmit" role="button" className="col-md-3 btn btn-primary" type="submit" value="Login" />
                    </div>

                    <div className="form-group">
                    <p>Need a new password?</p>
                    </div>

                </form>
                        
            }
            
        </>
    );

};

export default Login;