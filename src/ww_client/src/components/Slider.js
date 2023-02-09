import React, { useState, useEffect } from 'react'

function Slider({children, lide_n, typeClass}) {

    const [state, setState] = useState({
        current_slide_number: 0
    })

    return (

        <div className={String("group " + typeClass)}>
            {children}

            {/* { localStorage.getItem("mobile") === "true" ? */}

                {/* <div id="main_slider" className="slider">
                    <div className="slide-hl" onClick={
                        function(e){
                            setState((state + 1) % children.toArray.length)
                        }
                    }></div>
                    {
                        React.Children.map(children, (child) => {

                            if (child.props.slide_number === state.current_slide_number){
                                return React.cloneElement(child, {
                                    className: `${child.props.className} active-slide`
                                })

                            } else {
                                return null
                            }

                        })
                    }
                    <div className="slide-hr" onClick={
                        function(e){
                            if (state === 0) {
                                setState(children.toArray.length)
                            } else {
                                setState(state - 1)
                            }
                        }
                    }></div>
                </div> */}

            {/* : 
                children */}
            {/* } */}

        </div>
    )
}

export default Slider
