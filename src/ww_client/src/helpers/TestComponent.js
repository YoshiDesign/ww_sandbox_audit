import React from 'react'
import {useHistory, useLocation} from "react-router-dom"


function TestComponent() {

    let history = useHistory()
    let location = useLocation()
    let { from } = location.state || { from: { pathname: "/" } };

    function clicker1 () {
        history.push("/signup")
    }
    function clicker2 () {
        console.log(location)
        history.push(location)

        location.squee = "lol"
        history.push(location)
        console.log(location)
        
        history.goBack()
        console.log(history.location)
    }

    return (
        <div>
            <button onClick={clicker1}>1</button>
            <button onClick={clicker2}>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
        </div>
    )
}

export default TestComponent
