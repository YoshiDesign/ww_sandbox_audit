import React, {useContext} from 'react'

function LoadingComponent(props) {

    return (
        <div id="loader">

            <div className="c-wrapper Lw">
                <div className="bwa L L1"></div>
                <div className="bwa L L2"></div>
                <div className="bwa L L3"></div>
                <div className="bwa L L4"></div>
                <div className="bwa L L5"></div>
            </div>

            <div className="c-wrapper">
                <p className="Ltxt">{props.children}</p>
            </div>
            
            <div className="c-wrapper Lw2">
                <div className="bwa L L1"></div>
                <div className="bwa L L2"></div>
                <div className="bwa L L3"></div>
                <div className="bwa L L4"></div>
                <div className="bwa L L5"></div>
            </div>   

        </div>
    )
}

export default LoadingComponent
