import React, { useContext, useEffect, useState } from 'react'
import logo_proj_mobile from '../../../assets/images/map-tp.png'
import logo_proj from '../../../assets/images/logo_proj.png'
import { MapDataContext } from '../../../context/MapDataContext'
import { activateButtons } from '../../../helpers/utils'
import Slider from '../../Slider'
import LifeStatSlide from '../../slides/LifeStatSlide'

function NotebookLocations(props) {
    const MDC = useContext(MapDataContext)

    useEffect( ()=> {

        // activateButtons('life-src')

        if (
            MDC.mapState.notebooks.loc_notebook == null 
            && window.innerWidth > 768
            && window.innerHeight > 480
        ) {
            document.getElementById("notebook").classList.add('n-src')
        } else {
            document.getElementById("notebook").classList.remove('n-src')
        }

    }, [])

    // useEffect( ()=>{

    //     MDC.mapDispatch({
    //         type: "CHANGE_SEARCH",
    //         info_pane: window.location.search.includes('?loc=') ? "true" : false,
    //         notebook_type_abbrev: "loc",
    //         return_to: MDC.mapState.return_to
    //         // mapType
    //     })

    //     // console.log("Updated Location Notebook")
    //     // console.log(MDC.mapState.notebooks.loc_notebook)
    //     // console.log(MDC.mapState.info_pane)

    // }, [MDC.mapState.notebooks.loc_notebook])

    return (
        <div id="notebook" className={String(MDC.mapState.notebooks.loc_notebook == null ? "": "" )}>

            <>

                <h3 id="m_title">National Statistics</h3>
                <ul>
                    <li>
                        Here is a collection of nation-wide stat's which can attribute most to the overall cost of living.
                        Search for a location or select a county on the map for a closer look.
                    </li>
                </ul>
                <div className="btn-row">

                    <Slider>

                        <LifeStatSlide />

                    </Slider>

                </div>

                <h3>Discover:</h3>

                <ul>
                    <li>Select a county to dive into the economic statistics of over 19,000 cities.</li>
                    <li>Compare our cost of living statistics with occupations to see how you can optimize your work-life balance.</li>
                </ul>

                {window.innerWidth > 768 ? 
                    <img className="proj-logo" width="360" src={logo_proj} />
                : 
                    <img className="proj-logo-mobile" width="360" src={logo_proj_mobile} />
                }

            </>

        </div>
    )
}

export default React.memo(NotebookLocations)
