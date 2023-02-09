import React, {useEffect} from 'react'
import axios from 'axios'
import {
    StyledMainContent,
    StyledCTA
} from '../style/styled'

function _404() {

    useEffect( ()=>{
        axios.post('/quote', null, {
            proxy: {
                host: 'localhost',
                port: 4000
            }
        })
        .then( res => {
            let quote = res.data.quote
            document.getElementById("pq").innerText = quote
            console.log(res)
        })
    },[])

    return (
            <StyledMainContent>
                <StyledCTA>
                    <p className="msg-dark hi-focus">&lt;404/&gt;</p>
                    <section className="qs" id="quote">
                        <p id="pq" className="pq"></p>
                    </section>
                </StyledCTA>
            </StyledMainContent>
    )
}

export default _404
