import React, {useEffect, useContext, useState} from 'react'
import Radar from '../../../../../d-vis/Radar'

import { 
    StyledSubwindow,
    StyledPane,
 } from '../../../../../style/styled'
import { MapDataContext } from '../../../../../../context/MapDataContext'

const InfoPane = React.memo( (props) => {

    const MDC = useContext(MapDataContext)

    useEffect(()=>{
        // Inspected region selection has changed
        // console.log("Loc Notebook from InfoPane: ", MDC.mapState.notebooks.loc_notebook)

        // console.log(MDC.mapState.return_to)
        // console.log(MDC.mapState.info_pane)
        
    }, [MDC.mapState.notebooks.loc_notebook])

    /**
     * Add the extra width to the info pane, causing the animation
     */
    useEffect( () => {

        if (window.innerWidth > 768){

            setTimeout(function(){
                // document.getElementById("info-pane").classList.add('wadd')
            }, 30)

            return function(){
                // document.getElementById("info-pane").classList.remove('wadd')
            }
    
        }
    },[])

    return (
        <>
            {MDC.mapState.info_pane == true ?
                <>
                    {MDC.mapState.no_info === true ?

                        <>
                            <StyledPane info="1" className={window.location.search.includes('loc=') ? " " : "no-fill"} id="info-pane" infoPane >
                                <div className="homeIntro">
                                    <h3 className="bg-title">Missing Information</h3>
                                    <p>We're missing data for this county. You can help us in providing a more complete map by submitting a datasheet for us to review!</p>
                                    <ul>
                                        <li>County Information Datasheet</li>
                                        <li>Occupational Statistics Datasheet</li>
                                    </ul>
                                </div>
                            </StyledPane>
                        </>

                    :

                    <>
                    {/* <Log name="InfoPane" /> */}
                    <StyledPane info="1"
                        id="info-pane" infoPane >
                        {/* Color function code is duplicated in CoL options */} 
                        <div className="fl-row">

                            <StyledSubwindow windowSize={props.windowSize}>

                                <div className="title-contents">
                                    <h3 className="bg-title" id="ifstat-title">Info &amp; Statistics</h3>
                                </div>

                            </StyledSubwindow>

                            <StyledSubwindow radarinfo windowSize={props.windowSize}>
                                <h5 aria-label="relative cost of living section" className="rad-heading">Relative Cost of Living</h5>
                                <section className="rad-container">
                                    
                                    <div className="rad-legend rl3"><p className="rad-legend-3">  City</p></div>
                                    <div className="rad-legend rl1"><p className="rad-legend-1">  USA</p></div>
                                    <div className="rad-legend rl2"><p className="rad-legend-2">  State</p></div>
                                </section>
                                <div className="fl-stack">

                                    <Radar />

                                </div>
                            </StyledSubwindow>

                            <StyledSubwindow windowSize={props.windowSize}>

                                <div className="title-contents">

                                    <h3 className="bg-title l-pad-sm">Local Employers</h3>
                                    <ul id="topComp" className="main-ul l-pad-sm ">

                                    </ul>

                                </div>

                            </StyledSubwindow>

                            <StyledSubwindow windowSize={props.windowSize}>
                                <div className="title-contents">
                                    <h3 className="bg-title" id="schools-title">Schools</h3>
                                    <ul id="schools"> 
                                        
                    
                                        
                                    </ul>
                                </div>

                            </StyledSubwindow>

                        </div>

                    </StyledPane>
                    </>
                    }
                </>
            : null}
            
        </>
    )
})

export default InfoPane