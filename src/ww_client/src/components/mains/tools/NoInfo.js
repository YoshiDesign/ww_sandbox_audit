import React, {useContext, useState, useEffect, useRef} from 'react'
import {StyledPane} from '../../../components/style/styled'
import {MapDataContext} from '../../../context/MapDataContext'
/**
 * Note: type prop is only used if it is going to add some sort of function. 
 * It is for convenience, and should not be a dependency for implementing this component
 * @param {} props 
 * @returns 
 */

function NoInfo(props) {

    const MDC = useContext(MapDataContext)
    const ref = useRef()


    function close(e) {

        document.getElementById('no-info-pane').classList.add('hide-me')

    }

    function rst() {
        MDC.mapState.theMap.reset()
    }

    return (
        <StyledPane ref={ref} className="hide-me" noInfo id="no-info-pane">

            {props.type == 'creators' ? 
                <h5>No Data</h5>
            :
                <h5 className="nultxt">
                    We are missing data for this location.
                    {window.innerWidth <= 768 ? 
                        <span id="nd" onClick={close} className="close-me">X</span>
                    : 
                        <>
                            <br /><span onClick={rst} className="x1">Go Back</span>
                            <br /><span className="x2">Or press R</span>
                        </>
                    }
                </h5>
            }

            {window.innerWidth > 768 ? <p></p> : null}

        </StyledPane>
    )
}

export default React.memo(NoInfo)