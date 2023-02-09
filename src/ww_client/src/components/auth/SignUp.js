import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios'
import { Log } from '../../App';
import { AuthContext } from '../../context/AuthContext';
// import {c_names, getCookie} from '../../helpers/Cookie'
import styled from 'styled-components';
import {
    Redirect
} from 'react-router-dom'
// const SESSION_COOKIE=c_names.SESSION_COOKIE
// const AUTH_COOKIE=c_names.AUTH_COOKIE

const AgreeInput = styled.input`
    display:inline-block;
`

function SignUp (e) {
    
    const authContext = useContext(AuthContext)
    const [error, setError] = useState(null)
    const [form, setForm] = useState({
        name : "",
        handle: "",
        email: "",
        password: "",
        passwordConfirm: "",
        agree : false,   
    })

    // TODO Check for cookie first, ignore setcookie if its already there

    const signup = (e) => {
        e.preventDefault();
        setError(null)
        console.log("Signing up...", form)
        document.getElementById('signupSubmit').classList.add('dsub')
        document.getElementById('signupSubmit').setAttribute('disabled', '1')
        axios
            .post('/auth/signup', form, {
                proxy: {
                    host: 'localhost',
                        port: 4000
                }
            })
            .then( res => {

                if (!res.data.Success) {

                    console.log("not success")
                    console.log(res.data)

                    document.getElementById('signupSubmit').classList.remove('dsub')
                    setTimeout(function(){
                        document.getElementById('signupSubmit').removeAttribute('disabled')
                    }, 1000)
                    
                    setForm({...form, agree: false})
                    setError(res.data.message)
                    document.getElementById('agree').checked = false
                    return 0

                } else {
                    console.log("success")
                    console.log(res.data)
                    console.log(res.headers['set-cookie'])

                    window.location = "/"
                    
                }
            })
            .catch( err => {
                console.log(`[SIGNUP] Error ${err}`)
                // TODO Redirects
            });

        // The React gods made me do it
        return

    };

    // Redirect if already loggedin
    if (authContext.user) {
        window.location = "/"
    }

    return (
        <>
        <Log name="Sign Up" />
        { authContext.user ? 
            <Redirect to="/" />
            :

            <form role="form" aria-label="Sign up form" onSubmit={signup} >

                <p>Sign Up Form</p>
                {error != null ? <p className="err">{error}</p> : null}

                <div className="form-group">
                    <input required autoFocus="1" aria-label="Your name" placeholder="Your name" className="form-control" type="text" name="name"
                        value={form.name || ""}
                        onChange={(e) => setForm( {...form, name: e.target.value } )} />
                </div>


                <div className="form-group">
                    <input required autoFocus="1" aria-label="Choose a unique handle" placeholder="Your @handle" className="form-control" type="text" name="handle"
                        value={form.handle || ""}
                        onChange={(e) => setForm( {...form, handle: e.target.value } )} />
                </div>

                <div className="form-group">
                    <input required placeholder="Email" aria-label="Email" className="form-control" type="email" name="email" 
                        value={form.email || ""}
                        onChange={(e) => setForm( {...form, email: e.target.value } )} />
                </div>

                <div className="form-group">
                    <input required placeholder="Password" aria-label="Password" className="form-control" type="password" name="password" 
                        value={form.password || ""}
                        onChange={(e) => setForm( {...form, password: e.target.value } )} />
                </div>

                <div className="form-group">
                    <input required placeholder="Confirm your password" aria-label="Confirm password" className="form-control" type="password" name="passwordConfirm" 
                        value={ form.passwordConfirm || ""}
                        onChange={(e) => setForm( {...form, passwordConfirm: e.target.value } )} />
                </div>

                <div onClick={e => 
                    document.getElementById('agree').checked ? 
                    document.getElementById('agree').checked = true : 
                    document.getElementById('agree').checked = false} 
                    className="form-group">
                    <p><AgreeInput 
                    // defaultChecked={this.form.agree}
                    onChange={(e) => {
                        console.log(e.target.value)
                        let status = e.target.value ? true : false
                        setForm( {...form, agree: status} )
                    }}
                    id="agree" type="checkbox" name="agree" /> I surrender</p>     
                </div>

                <div className="form-group">
                    <input required 
                    
                    id="signupSubmit" role="button" className="col-md-3 btn btn-primary" type="submit" value="Join" />
                </div>
            </form>

            }
        </>
    );
};

export default SignUp;