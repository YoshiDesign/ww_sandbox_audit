import React, { useEffect, useContext, memo } from 'react'
import { MapDataContext } from '../../../context/MapDataContext'

function CensusList({census, align}) {

    const MDC = useContext(MapDataContext)

    let pop_color
    let pre
    try {
        if (census.pop_3 == "0.0%")
            pop_color = ""
        else
            pop_color = census.pop_3.indexOf("-") !== -1 ? "tomato" : "#00ff00"
            pre = census.pop_3.indexOf("-") !== -1 ? "" : "+"

        let women = census.age_4
        let men =   String(parseFloat(100 - parseFloat(women))) + "%"

        return (
            <>
                {MDC.mapState.info_pane === false ? 
                    <>
           {/* <div id="tip" className="l">
               <p id="stat_1"></p>
               <p id="stat_2"></p>
           </div> */}
            <ul className={String("census-tip-" + align + " census-tip fade-in")}>
                <li className="li-head"></li>
                <li className={"census-" + align}>
                    <table className="inline-table">
                        <thead><tr><th>Population: </th><th>{census.pop_1}</th></tr></thead>
                        <tbody>
                           <tr key={String("pop_3") + "-row"}>
                               <td >Since 2010:</td><td>&nbsp;&nbsp;&nbsp;<span key={String("pop_3") + "-data"} style={{padding:"2px" ,background:"#111", borderRadius: "5px", color: pop_color}}>{pre + census.pop_3}</span></td>
                           </tr>
                           <tr key={String("women") + "-row"}>
                               <td >Women: </td><td key={String("women") + "-data"}>&nbsp;&nbsp;&nbsp;{women}</td>
                           </tr>
                           <tr key={String("men") + "-row"}>
                               <td >Men: </td><td key={String("men") + "-data"}>&nbsp;&nbsp;&nbsp;{men}</td>
                           </tr>
                           <tr key={String("age_3") + "-row"}>
                               <td >Age 65+: </td><td key={String("age_3") + "-data"}>&nbsp;&nbsp;&nbsp;{census.age_3}</td>
                           </tr>
                           <tr key={String("inc_3") + "-row"}>
                               <td >In Poverty: </td><td key={String("inc_3") + "-data"}>&nbsp;&nbsp;&nbsp;{census.inc_3}</td>
                           </tr>
                       </tbody>
                   </table>

                   <table className="inline-table">
                       { align == "right" ? <thead><tr><th></th><th>Education</th></tr></thead> : <thead><tr><th>Education</th><th></th></tr></thead>}
                       <tbody>
                           <tr key={String("edu_1") + "-row"}>
                               <td >High School Grad's: </td><td key={String("edu_1") + "-data"}>&nbsp;&nbsp;&nbsp;{census.edu_1}</td>
                           </tr>
                           <tr key={String("edu_2") + "-row"}>
                               <td >Bachelor's or Higher: </td><td key={String("edu_2") + "-data"}>&nbsp;&nbsp;&nbsp;{census.edu_2}</td>
                           </tr>
                       </tbody>
                   </table>

                   <table className="inline-table">
                   { align == "right" ? <thead><tr><th></th><th>Housing</th></tr></thead> : <thead><tr><th>Housing</th><th></th></tr></thead>}
                           
                       <tbody>
                           <tr key={String("inc_1") + "-row"}>
                               <td >Med. Household Income </td><td key={String("inc_1") + "-data"}>&nbsp;&nbsp;&nbsp;{census.inc_1}</td>
                           </tr>
                           <tr key={String("hou_6") + "-row"}>
                               <td >Med. Monthly Rent: </td><td key={String("hou_6") + "-data"}>&nbsp;&nbsp;&nbsp;{census.hou_6}</td>
                           </tr>
                           <tr key={String("hou_4") + "-row"}>
                               <td >Med. Monthly Mortgage: </td><td key={String("hou_4") + "-data"}>&nbsp;&nbsp;&nbsp;{census.hou_4}</td>
                           </tr>
                       </tbody>
                   </table>
               </li>
           </ul>
       </>  
        : null }
        </>
           
        )
    } catch(e) {
        console.error(e)
        return (
            <>
            </>
        )
    }
}

function lineCursorEvent(e){

    // Moving mouse cursor and tooltip display
    var mapTop = null
    var mapLeft = null
    var mapWidth = null
    var mapHeight = null
    var st_1 = null
    var st_2 = null
    var lc_1 = null
    var lc_2 = null
    var check_st_container

    // var bleft, bright
    try {
        if (window.innerWidth > 768){

            e.stopPropagation()
            // Init
            if (mapTop === null && mapLeft === null) {
                mapLeft = document.getElementById("map-wrapper").getBoundingClientRect().x
                mapTop = document.getElementById("map-wrapper").getBoundingClientRect().y
                mapWidth = document.getElementById("map-wrapper").getBoundingClientRect().width
                mapHeight = document.getElementById("map-wrapper").getBoundingClientRect().height
                lc_1 = document.getElementById("lc-1")
                lc_2 = document.getElementById("lc-2")

                // If these don't exist you're ognna have a bad time. This is a quick n' dirty fix. Ideally, all of this code should be in LineCursor.js and respond to React design patterns :')
                check_st_container = document.getElementsByClassName('st_container')
                if (check_st_container.length > 0) {
                    st_1 = document.getElementById("st_1")
                    st_2 = document.getElementById("st_2")
                }
                // bright = document.getElementById("bright")
                // bleft = document.getElementById("bleft")

                if (!lc_1 || !lc_2) return
            }

            // The position of the mouse over the map-wrapper
            let px = (e.clientX - mapLeft)
            let py = (e.clientY - mapTop)

            if (px < 355) {
                // mapState.theMap.tooltip = "R"

                // Census tooltip
                if (!lc_1.classList.contains('hide-me')){
                    lc_1.classList.add('hide-me')
                }
                if (lc_2.classList.contains('hide-me')){
                    lc_2.classList.remove('hide-me')
                }

                if (check_st_container.length > 0) {
                    // Selected Stat tooltip (above census info)
                    if (st_1.classList.contains('hide-me')) {
                        st_1.classList.add('hide-me')
                    }
                    if (st_2.classList.contains('hide-me')) {
                        st_1.classList.remove('hide-me')
                    }
                }

                // lc_2.style.width = String(mapWidth - (px + 20)) + "px"
                if (py > 230) py = 230
                lc_2.style.top = String(py - 31) + "px"

                // bright.classList.remove("hide-me")
                // bleft.classList.add("hide-me")
                // bright.style.top = String(py - 31) + "px"

            } else {
                // mapState.theMap.tooltip = "L"

                // Census tooltip
                if (lc_1.classList.contains('hide-me')){
                    lc_1.classList.remove('hide-me')
                }
                if (!lc_2.classList.contains('hide-me')){
                    lc_2.classList.add('hide-me')
                }

                if (check_st_container.length > 0) {
                    // Selected Stat tooltip (above census info)
                    if (st_1.classList.contains('hide-me')) {
                        st_1.classList.remove('hide-me')
                    }
                    if (st_2.classList.contains('hide-me')) {
                        st_1.classList.add('hide-me')
                    }
                }

                if (py > 230) py = 230
                // lc_1.style.width = String(px - 20) + "px"
                lc_1.style.top = String(py - 28) + "px"

                // bleft.classList.remove("hide-me")
                // bright.classList.add("hide-me")
                // bleft.style.top = String(py - 28) + "px" 

            }

        }
    } catch (err) {
        console.error(err)
        // window.location = window.location
    }
}

function lineCursorEndEvent(e){

    try {
        
        if (window.innerWidth > 768) {
            let lc1 = document.getElementById("lc-1")
            let lc2 = document.getElementById("lc-2")
            if (lc1 && lc2) {
                lc1.classList.add('hide-me')
                lc2.classList.add('hide-me')
            }
        }

    } catch(err){
        console.error(err)
    }

    return
}

function LineCursor() {

    const MDC = useContext(MapDataContext)

    useEffect( () => {



        if (MDC.mapState.notebook_type_abbrev == "loc" || MDC.mapState.notebook_type_abbrev == "occ" || MDC.mapState.notebook_type_abbrev == "cou") {
            
            // Control the census tooltip that appears over the map
            document.getElementById('map-wrapper').addEventListener('mouseover', lineCursorEvent, true)
            document.getElementById('map-wrapper').addEventListener('mouseleave', lineCursorEndEvent, true)

            return function(){
                document.getElementById('map-wrapper').removeEventListener('mouseover', lineCursorEvent, true)
                document.getElementById('map-wrapper').removeEventListener('mouseleave', lineCursorEndEvent, true)
            }
        }

    }, [MDC.mapState.mobile, window.innerWidth, MDC.mapState.notebook_type_abbrev])

    return (
        <>

            {(MDC.mapState.notebook_type_abbrev == "loc" || MDC.mapState.notebook_type_abbrev == "occ" || MDC.mapState.notebook_type_abbrev == "cou") ?
            <>
                {window.innerWidth > 768 && MDC.census.cur_census_title ? 
                    <>
                        <div className={window.location.search.includes("?loc=") ? "shift-lc hide-me l-cursor" : "l-cursor hide-me"} id="lc-1">
                            {MDC.mapState.info_pane === false ? 
                            
                                <div className="st_container" id="st_1">
                                    <p className="st" id="st_1_stat_1"></p>
                                    <p className="st" id="st_1_stat_2"></p>
                                </div>

                            : null}
                            <div className="tips" id="tooltipL">
                                <p className="cname" id="namesL">{MDC.census.cur_census_title ? String(MDC.census.cur_census_title) : null } <span style={{fontWeight: "lighter"}} className="_nodata hide-me"><br />Census data is unavailable.</span></p>
                                {MDC.census.cur_census ? 
                                    <CensusList id="dataL" align={"left"} census={MDC.census.cur_census} />
                                :
                                    null
                                }
                            </div>
                        </div>

                        <div className="l-cursor hide-me" id="lc-2">

                        { MDC.mapState.info_pane === false ? 

                            <div className="st_container" id="st_2">
                                <p className="st" id="st_2_stat_1"></p>
                                <p className="st" id="st_2_stat_2"></p>
                            </div>

                            :null

                        }

                            <div className="tips" id="tooltipR">
                                <p className="cname" id="namesR">{MDC.census.cur_census_title ? String(MDC.census.cur_census_title) : null } <span style={{fontWeight: "lighter"}} className="_nodata hide-me"><br />Census data is unavailable.</span></p>

                                {MDC.census.cur_census ? 
                                    <CensusList id="dataR" align={"right"} census={MDC.census.cur_census} />
                                :
                                    null
                                }

                            </div>
                        </div>
                    </>
                :
                    null
                }
        
        </>
        :
            null
        }
           
        </>
    )
}

export default memo(LineCursor)