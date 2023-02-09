import React, { useContext, useEffect, useState } from 'react'
import {Log} from '../../../App'
import logo_proj_mobile from '../../../assets/images/map-tp.png'
import logo_proj from '../../../assets/images/logo_proj.png'
import { MapDataContext } from '../../../context/MapDataContext'
import Gauge from '../../d-vis/selectors/Gauge'
import Slider from '../../Slider'
import WorkStatSlide from '../../slides/WorkStatSlide'
import {activateButtons, getReturnTo} from '../../../helpers/utils'
import {dollarize, titleCaseUnderscore} from '../../../helpers/functional/stringFuncs'
import {fip_to_state} from '../../../helpers/utils'
import { notebookDispatch } from '../../../context/utils'

function NotebookOccupations(props) {

    const MDC = useContext(MapDataContext)
    const [ix_count_0, setIxCount0] = useState(5)
    const [ix_count_1, setIxCount1] = useState(5)
    const [ix_count_2, setIxCount2] = useState(5)

    const setIx = {
        "0" : [ix_count_0, setIxCount0],
        "1" : [ix_count_1, setIxCount1],
        "2" : [ix_count_2, setIxCount2],
    }
    
    function showMore(e){

        let cat = e.currentTarget.id.split("_")[1]

        if(setIx[cat][0] == 5) {
            setIx[cat][1](25)
            e.currentTarget.textContent = "Show Less"
        }
        else if (setIx[cat][0] == 25){
            setIx[cat][1](5)
            e.currentTarget.textContent = "Show More"
        }

    }

    function selectRegion(e) {

        let fips = e.currentTarget.dataset['fips']
        let url = new URL(window.location)
        
        url.searchParams.append("loc",  String(fips))
        window.history.pushState(null, "County Search ", url.pathname + url.search)

        MDC.mapDispatch({
            ...MDC.mapState, 
            type: "SELECT_QUERY",
            selections: 1,
            info_pane: true,
            refetch: 1,
            notebook_type_abbrev: "occ",
            new_location: fips,
            new_occupation: null
        })

    }
    function  highlightRegion(e) {
        document.getElementById(e.currentTarget.dataset['fips']).classList.add('hl-region')
    }
    function  unHighlightRegion(e) {
        document.getElementById(e.currentTarget.dataset['fips']).classList.remove('hl-region')
    }
    
    return (
        <>

            {/*Not even sure if this nested ternary makes sense, it works. Work faster GoGoGoGoGo*/}
        <div id="notebook" className={MDC.mapState.notebooks.occ_notebook == null && window.innerWidth > 768 && window.innerHeight > 480 ? "n-src" : window.innerWidth > 768 ? "dt-pad" : null}>
                {/* <button onClick={manualOverride}></button> */}
                {!MDC.mapState.notebooks.occ_notebook ? // Default
                    <>
                        <h3>Search</h3>
                        <ul>
                            <li key="lol1" >Occupation statistics can reveal a lot about what it's like to have a particular job 
                                while living in a specific region. Please keep in mind that the data is always changing. We are doing
                                our best to keep our map up to the minute!
                            </li>

                        </ul>
                        <h3>Discover</h3>
                        <ul>
                            <li key="lol2">Where does a job pays the most? Where are your net earnings higher due to the cost of living in a particular area?</li>
                            <li key="lol3">The availability of a job can change based on the size of a county's workforce along with the number of jobs available for a specific occupation.</li>
                            <li key="lol4">How common or uncommon is an occupation in a particular area, and what effect does this have on its compensation?</li>
                        </ul>
                        {window.innerWidth > 768 ? 
                        
                            <img className="proj-logo" width="360" src={logo_proj} />
                        : 
                            <img className="proj-logo-mobile" width="360" src={logo_proj_mobile} />
                        }
                    </>
                :
                    <>
                        {/* NO DATA */}
                        {MDC.mapState.notebooks.occ_notebook['error'] || MDC.mapState.notebooks.occ_notebook['avg_an'] == 0 || Object.keys(MDC.mapState.notebooks.occ_notebook['tf0']).length == 0 ? 
                            <h3 style={{color:"ghostwhite", textAlign:"center"}}>We're missing data for this occupation</h3>
                        :   
                            <>
                                {props.children}

                                <Slider typeClass="occupation-slider" >
                                    <WorkStatSlide />
                                </Slider>

                                {/* <div className="group">
                                    <h3>Ranked - Potential Job Availability</h3>
                                    <ul>
                                        <li key="tfavdes1" style={{fontSize:"12px"}}> &gt;100% could mean a shortage of workers or a declining job market. There might be other implications beyond the scope of our research.</li>
                                        <li key="tfavdes2" style={{fontSize:"12px"}}> These calculations are based on each county's workforce population regarding this specific occupation, coupled with the total jobs available within this specific occupation, as reported by the U.S. Bureau of Labor Statistics. This calculation is then weighted by the standard deviation of each displayed region's total working population across all professions. Taking into account every displayed regions workforce and the total number of jobs, per 1000 jobs, which fall into this specific occupation, a general estimate of potential job availability is given as a percent where the higher percentages indicate a greater chance of finding employment in this profession. Please note that these are only estimates and represent an effort to bring you the most meaningful inferences from our data.</li>
                                        <li key="tfavdes3" >Hover over a list item to highlight it on the map. Click any list item to see more information for the region.</li>
                                    {MDC.mapState.notebooks.occ_notebook['tfav']

                                    ? 
                                        Object.keys(MDC.mapState.notebooks.occ_notebook['tfav']).map(function(index){

                                            try{
                                                
                                                return (
                                                    <li key={"tfav" + String(index)} onMouseEnter={highlightRegion} onMouseLeave={unHighlightRegion} data-fips={MDC.mapState.notebooks.occ_notebook['tfav'][index][0]} className={"tf-list" + String(index >= 6 ? " hide-me" : "")} onMouseEnter={highlightRegion} onMouseLeave={unHighlightRegion} onClick={highlightRegion} data-fips={MDC.mapState.notebooks.occ_notebook['tfav'][index][0]} ><span>{index}. </span><span style={{textDecoration: "underline"}}>{titleCaseUnderscore(MDC.mapState.notebooks.occ_notebook['tfav'][index][2])}, {titleCaseUnderscore(fip_to_state[MDC.mapState.notebooks.occ_notebook['tfav'][index][0].substring(0,2)])}</span><span className="tf-right-item">{MDC.mapState.notebooks.occ_notebook['tfav'][index][1]}</span></li>
                                                )
                                            }

                                            catch(err){
                                                
                                            }


                                        })
                                    : 

                                        <p>No Data</p>

                                    }
                                    <li key="tfavmore" className="show-more" data-list="tfav">Show More</li>
                                    </ul>
            
                                </div> */}

                                <div className="group">
                                    <h3>Ranked Salaries - Entry Level</h3>
                                    <ul>
                                        <li key="tf0" style={{fontSize:"12px"}}>Top entry level salaries across the United States. Hover over a list item to highlight it on the map. Click any list item to see more information for the region.</li>
                                        {MDC.mapState.notebooks.occ_notebook['tf0']

                                        ? 
                                            Object.keys(MDC.mapState.notebooks.occ_notebook['tf0']).map(function(index){

                                                try{
                                                    
                                                    return (
                                                        <li key={"tf0" + String(index)} data-fips={MDC.mapState.notebooks.occ_notebook['tf0'][index][2]} className={"tf-list" + String(index >= ix_count_0 ? " hide-me" : "")} onMouseEnter={highlightRegion} onMouseLeave={unHighlightRegion} onClick={selectRegion} data-fips={MDC.mapState.notebooks.occ_notebook['tf0'][index][2]} ><span>{String(Number(index) +1)}. </span><span style={{textDecoration: "underline"}}>{titleCaseUnderscore(MDC.mapState.notebooks.occ_notebook['tf0'][index][3])}, {titleCaseUnderscore(fip_to_state[MDC.mapState.notebooks.occ_notebook['tf0'][index][2].substring(0,2)])}</span><span className="tf-right-item">{dollarize(MDC.mapState.notebooks.occ_notebook['tf0'][index][0])}</span></li>
                                                    )
                                                }

                                                catch(err){
                                                    console.error("NoteBookOccupations:1:", err)
                                                }


                                            })
                                        :

                                            <p>No Data</p>

                                        }
                                        <li onClick={showMore} id="tfcat_0" key="tf0more" className="show-more" data-list="tf0">Show More</li>
                                    </ul>
                                    {/*  */}
                                </div>

                                <div className="group">
                                    <h3>Ranked Salaries - Associate</h3>
                                    <ul>
                                        <li key="ttf1x" style={{fontSize:"12px"}}>Top associate level salaries across the United States. Hover over a list item to highlight it on the map. Click any list item to see more information for the region.</li>
                                        {MDC.mapState.notebooks.occ_notebook['tf1']

                                        ? 
                                            Object.keys(MDC.mapState.notebooks.occ_notebook['tf1']).map(function(index){

                                                try{
                                                    
                                                    return (
                                                        <li key={String(MDC.mapState.notebooks.occ_notebook['tf1'][index][0]) + String(index)} data-fips={MDC.mapState.notebooks.occ_notebook['tf1'][index][2]} className={"tf-list" + String(index >= ix_count_1 ? " hide-me" : "")} onMouseEnter={highlightRegion} onMouseLeave={unHighlightRegion} onClick={selectRegion} data-fips={MDC.mapState.notebooks.occ_notebook['tf1'][index][2]} ><span>{String(Number(index) +1)}. </span><span style={{textDecoration: "underline"}}>{titleCaseUnderscore(MDC.mapState.notebooks.occ_notebook['tf1'][index][3])}, {titleCaseUnderscore(fip_to_state[MDC.mapState.notebooks.occ_notebook['tf1'][index][2].substring(0,2)])}</span><span className="tf-right-item">{dollarize(MDC.mapState.notebooks.occ_notebook['tf1'][index][0])}</span></li>
                                                    )
                                                }

                                                catch(err){
                                                    console.error("NoteBookOccupations::", err)
                                                }
                        
                                            })
                                        : 

                                            <p>No Data</p>

                                        }
                                       
                                        <li onClick={showMore} id="tfcat_1" key="tf1more" className="show-more" data-list="tf1">Show More</li> 
                                    </ul>
                                    {/*  */}
                                </div>

                                <div className="group">
                                    <h3>Ranked Salaries - Senior</h3>
                                    <ul>
                                    <li key="tf2" style={{fontSize:"12px"}}>Top senior level salaries across the United States. Hover over a list item to highlight it on the map. Click any list item to see more information for the region.</li>
                                    {MDC.mapState.notebooks.occ_notebook['tf2']

                                    ? 
                                        Object.keys(MDC.mapState.notebooks.occ_notebook['tf2']).map(function(index){

                                            try{
                                                
                                                return (
                                                    <li key={"tf2" + String(index)} className={"tf-list" + String(index >= ix_count_2 ? " hide-me" : "")} onMouseEnter={highlightRegion} onMouseLeave={unHighlightRegion} onClick={selectRegion} data-fips={MDC.mapState.notebooks.occ_notebook['tf2'][index][2]} ><span>{String(Number(index) +1)}. </span><span style={{textDecoration: "underline"}}>{titleCaseUnderscore(MDC.mapState.notebooks.occ_notebook['tf2'][index][3])}, {titleCaseUnderscore(fip_to_state[MDC.mapState.notebooks.occ_notebook['tf2'][index][2].substring(0,2)])}</span><span className="tf-right-item">{dollarize(MDC.mapState.notebooks.occ_notebook['tf2'][index][0])}</span></li>
                                                )
                                            }

                                            catch(err){
                                                console.error("NoteBookOccupations:2:", err)
                                            }

                                        })
                                    : 

                                        <p>No Data</p>

                                    }
                                    <li onClick={showMore} id="tfcat_2" key="tf2more" className="show-more" data-list="tf2">Show More</li>
                                    </ul>
                                    {/*  */}
                                </div>

                                {/* The Gauge. This section sits on top of the display */}
                                <div style={{"marginLeft": "7px"}} className="dataTable sit-top">
                                
                                    <div className="m-gauge-c">
                                        <h5 id="m_title">{MDC.mapState.notebooks.occ_notebook['name']}</h5>
                                        

                                        <>
                                            <div className="gauge-mg-top">

                                                <div id="gtt" className= "gauge-tooltip">
                                                    <p>
                                                        <span className="tt-left">Annual Median: {dollarize(MDC.mapState.notebooks.occ_notebook['max_an'] / 2)}</span>    
                                                        <span className="tt-right">Annual Average: {dollarize(MDC.mapState.notebooks.occ_notebook['avg_an'])}</span>
                                                    </p>
                                                </div>
                                                <div className="gd">
                                                    { MDC.mapState.notebooks.occ_notebook['avg_an'] > (MDC.mapState.notebooks.occ_notebook['max_an'] / 2) ? 
                                                        <p className="tableText">
                                                            <span style={{color:"#58f46f"}}>&#9650;</span> &nbsp;This occupation's average salary is above its median.
                                                        </p>
                                                    :
                                                        <p className="tableText">
                                                            <span style={{color:"tomato"}}>&#9660;</span> &nbsp;This occupation's average salary is below its median.
                                                        </p>
                                                    }
                                                    <Gauge _id={"_gradient"} avg_an={MDC.mapState.notebooks.occ_notebook['avg_an']} max_an={MDC.mapState.notebooks.occ_notebook['max_an']} />
                                                </div>

                                            </div>
                                        </>
                                    </div>
                                
                                </div>
                            </>
                        }
                    </>
                }
            </div>

        </>
    )

}

export default React.memo(NotebookOccupations)
