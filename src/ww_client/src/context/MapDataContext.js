import React, { useReducer, useEffect, useState } from 'react'
import { apiFetchQueriedInformation, updateColors, apiFetchAndUpdateStatistics} from './utils'
import { mapReducer } from './reducers/mapReducer'
import HelperBar from '../components/HelperBar'
import { StyledQueryWindow, StyledMapWindow } from '../components/style/styled'
import NotebookOccupations from '../components/mains/notebook/NotebookOccupations'
import NotebookLocations from '../components/mains/notebook/NotebookLocations'
import NotebookCreators from '../components/mains/notebook/NotebookCreators'
import NotebookCountry from '../components/mains/notebook/NotebookCountry'
import {useWindowSize} from '../helpers/functional/windowHook'
import NoInfo from '../components/mains/tools/NoInfo'
import NationGraphs from '../components/mains/notebook/charts/NationGraphs'
import {_disabledCountries, drawAnyMap, countries_title, countries_abbrev} from '../components/Maps/utils/utils'

import {
    Switch,
    Route,
    useRouteMatch,
  } from "react-router-dom";
import InfoPane from '../components/mains/navigator/mobile/nautilus/panes/InfoPane'
import HomePane from '../components/mains/navigator/mobile/nautilus/panes/HomePane'

export const MapDataContext = React.createContext()

/**
 * The initial state given to our Map Reducuer
 */
const initState =  { 

    ready: false,               // Unused?
    init: 1,                    // Unused?
    mapAnchor: null,            // Probably obsolete
    theMap: null,               // Definitely in use
    mapdataset: null,           // Refactored
    cache_data: null,           // Definitely in use
    mapType: "",                // Currently "country" or "globe"
    currentCountry: "/world",
    currentCountryTitle: "All Countries",
    selections: 0,                          // Definitely in use. Needs audit
    return_to: {back: "", search: ""},      // Definitely in use. Return to /nbta?search=...
    current_nation_stats: null,
    disabledCountries: _disabledCountries,  // Work | Life will not be available where true
    
    // Default layout for colors and legend
    color_swatch : "1",
    bimono: "monovar",

    atts: [],       // Current attributes being observed (lq, pk, em, col ...) in an array. 2 at most. This is why we don't need to update attributes on every county with available data.
    query_type: "", // occupations, locations, or creators
    search_type: "",
    ids: {/*lq:"lq",*/ pk:"pk", em:"em", ex0:"ex0", ex1:"ex1", ex2:"ex2", rav:"rav", mhc:"mhc", col:"col", r0:"r0", r1:"r1", r2:"r2", r3:"r3", r4:"r4"},
    notebook_type_abbrev: null,

    no_info : false,            // In use. Data was missing to create the info-pane, 'true' prompts the no-info-pane
    info_pane: false,           // Definitely in use
    
    notebooks: {
        occ_notebook: null,
        loc_notebook: null,
        cre_notebook: null,
    },

    new_location: null,
    new_occupation: null,
    
    _uri: null,                 // Definitely in use
    nautilus: null,
    co_visited: [],
    mobile: false,

    cDomain : {},           // Our current dataset's domain organized by datapoint key(s) -- ex. {col:[12,436,23562,26,26....], mhc:[32532,23523,2352,235,....]}}
    data: {},               // (huge) Our current dataset's data organized by fip code w/ key(s) -- ex {"1001" : {mhc:1245, col:12525}, "2002" : {mhc:214...} ...}
    refetch : 0,            // When 0 the application will not allow outbound requests to the server
    v_1 : null,             // Determine what data our WFC's bivariate chloropleth displays
    v_2 : null,             // Determine what data our WFC's bivariate chloropleth displays
    sortKeys: null,         // key(s) we're currently accessing for data set(s) - allows consistent placement when 2 datasets are present as a bivariate
    colorScales: null,      // Functions used to determine color magnitudes
    stats : {stat_1: null, stat_2: null}, // Used to keep stats separated so we don't request 2 stats from 2 unrelated groups
    loading: true,
}

const initNautState = {
    ip: false,
    rp: false,
    lp: false,
    left_spin: false,
    right_spin: false,
    naut_open: false
}

export function MapDataProvider (props) {
    
    const windowSize = useWindowSize()
    const [mapState, mapDispatch] = useReducer(mapReducer, initState)
    const [nautState, updateNautState] = useState(initNautState)
    const [census, updateCensus] = useState({
        cur_census_title: null,
        cur_census: null
    })

    // This state object is provided to both <NotebookCountry> and <NationGraphs>
    // <NotebookCountry> adds ID's to it, which tells <NationGraph> where to look via a lookup table (lookup_tables.js -> nation_stat_categories)
    const [nationGraphs, updateNationGraphs] = useState([])

    let match = useRouteMatch();

        /**
     * @important
     * This is the MapDataContext's initialization logic.
     * 
     * Note:
     * - /map should always be the first item of the uri.
     * - This Context Provider is only used within the "/map" route
     * - This controls:
     *      - The map currently being rendered and any associated meta-data
     *      - Which notebook (<...Pane>) is open
     */
         useEffect( () => {

            // Gather information and set defaults
            let url = new URL(window.location),
            path = url.pathname,
            nbta = "",
            mapType = "",
            currentCountry = url.searchParams.get("q") ? "/" + url.searchParams.get("q") : "/world",   // Prepended with / for "historical" purposes (redis keys are prepended with /)
            currentCountryTitle = countries_title[currentCountry],
            info_pane = url.searchParams.get("loc") ? true : false

            console.log("MDC []", currentCountry, currentCountryTitle)
    
            // Determine the category, if selected
            if (path.includes('/locations'))   { nbta = "loc"; mapType = "country" }
            if (path.includes('/occupations')) { nbta = "occ"; mapType = "country" }
            if (path.includes('/country'))     { nbta = "cou"; mapType = "country" }
            if (path.includes('/home'))        { nbta = "hom"; mapType = "country" }
            if (path.includes('/creators'))    { nbta = "cre"; mapType = "globe" }
            // Mobile state - This effects the Home button's appearance
            if (window.innerWidth <= 768 && window.location.pathname == "/map/home" && nautState.lp == false) {
                nbta = ""
            }

            mapDispatch({
                ...mapState, 
                type: "MDC_INIT_APP",
                currentCountry: currentCountry || "/world",
                currentCountryTitle: currentCountryTitle || "All Countries",
                mobile: windowSize.width <= 768,
                mapType: mapType,
                notebook_type_abbrev: nbta,
                info_pane: info_pane
            })
    
            // Fallback condition - TODO
            if (window.location.search.includes("undefined")) {
                window.location = "/"
            }
    
        }, [])


    /**
     * @useEffect
     * api/datas/{notebook_type_abbrev}
     * This useEffect is activated by any ID that must be queried.
     * The notebook which is established given the result of the query determines what is being rendered.
     */
    
    useEffect( () => {

        console.log("API Fetch Queried Information mapState: ", mapState)
        
        apiFetchQueriedInformation(mapState.new_location, mapState.new_occupation, mapState.notebook_type_abbrev, mapDispatch, mapState.currentCountry);
    
    }, [mapState.selections])

    /**
     * @seEffect
     * This UseEffect listens for color options
     */
    useEffect( () => {

        updateColors(mapState.data, mapState.colorScales, mapState.color_swatch, mapState.sortKeys, mapState.ready)

    }, [mapState.color_swatch])

    useEffect(() => {
        console.log("UE::::::::::::::::::",nautState)
        if (window.innerWidth <= 768) {

            if (nautState.lp == true || nautState.rp == true) {
                document.getElementById("map-wrapper").classList.add('resize-mw')
            }
            else {
                document.getElementById("map-wrapper").classList.remove('resize-mw')
            }

        }
    }, [nautState.lp, nautState.rp])
    
    useEffect( () => {

        if (mapState.mapType == '') return

        let url = new URL(window.location)
        let search = url.searchParams.get("q")
        if (!search) { search = "/world" }

        console.log("[MDC:mapType || currentCountry]: ", {"Search": search, "mapType": mapState.mapType, "currentCountry": mapState.currentCountry})

        if (mapState.mapType == "country" && search) {
            console.log("rendering country...")
            drawAnyMap(mapState.currentCountry, mapState, mapDispatch, census, updateCensus)
        }
        // else if(mapState.mapType == "globe"){
        //     drawAnyMap("/world", mapState, mapDispatch, census, updateCensus)
        // }
        else if (mapState.mapType == "country" && !search) {
            console.log("[ERROR]: See MDC- no search parameter (r) was given")
        }

    }, [mapState.mapType, mapState.currentCountry])

    /**
     * This useEffect listens to changes in. (selecting stat buttons)
     * _url can be either "api/datas/wfc" || "api/datas/col"
     * MDC.mapState.occ_code
     * MDC.mapState.stats
     * MDC.mapState.v_2
     */
    useEffect( () => {

        apiFetchAndUpdateStatistics(mapState, mapDispatch)

    }, [mapState.stats, mapState.v_2, mapState.v_1, mapState.occ_code])

    // useEffect(() => {
    //     // console.log("Census Changed....")
    //     // console.log(census)

    //     // // Reveal the tooltip. You don't need to check which one is active, it's handled by the LineCursor component
    //     // document.getElementById('namesR').classList.remove('hide-me')
    //     // document.getElementById('namesL').classList.remove('hide-me')

    // }, [census.cur_census])

    // useEffect(() => {
    //     console.log("MDC [mapState.notebook_type_abbrev]:", mapState.notebook_type_abbrev)
    // },[mapState.notebook_type_abbrev])

    // Fires on every window resize event
    useEffect(()=>{

        console.log("MDC Window Resize")

        mapDispatch({
            ...mapState, 
            mobile: windowSize.width <= 768,
            type: "SET_WINDOW_SIZE" 
        })

    },[windowSize.width])

    return (
        <> 
            {/* mapState and mapDispatch come from  */}
            {/* const [mapState, mapDispatch] = useReducer(reducer, initState) */}
            {/* Located in MainsChart.js */}
            <MapDataContext.Provider value={{
                mapState, 
                mapDispatch, 
                census, 
                updateCensus, 
                nationGraphs, 
                updateNationGraphs,
                nautState, 
                updateNautState}}>
                <>
                    <HelperBar mobile={localStorage.mobile == "true" ? true : false} />
                    <div className="module" id="main-module">


                            { localStorage.getItem("mobile")  === "false" ? 
                                <>
                                    
                                    <Switch>

                                        <Route path={`${match.path}/creators`} exact>

                                            {mapState.info_pane == false ? 
                                                <StyledQueryWindow query="creators">
                                                    <NotebookCreators />
                                                </StyledQueryWindow>
                                            :
                                                <>
                                                    {/* <NoInfo type="creators" />
                                                    <InfoPane occupations={false} locations={false} creators={true}></InfoPane> */}
                                                </>
                                            }

                                        </Route>

                                        <Route path={`${match.path}/home`} exact>
                                            {/* TODO This info pane should never be available. Not dealing with it rn */}
                                            {mapState.info_pane == false ? 
                                                <StyledQueryWindow query="home">
                                                    <HomePane/>
                                                </StyledQueryWindow>
                                            :
                                                <>
                                                    {/* <NoInfo type="home" />
                                                    <InfoPane occupations={false} locations={false} creators={false}></InfoPane> */}
                                                </>
                                            }
                                            
                                        </Route>

                                        <Route path={`${match.path}/occupations`}>
                                            
                                            {mapState.info_pane == false ? 
                                                <StyledQueryWindow query="occupations">
                                                    <NotebookOccupations />
                                                </StyledQueryWindow>
                                            :
                                                <StyledQueryWindow query="info">
                                                    <NoInfo type="occupation" />
                                                    <InfoPane occupations={true} locations={false} creators={false}></InfoPane>
                                                </StyledQueryWindow>
                                            }
                                            
                                        </Route>

                                        <Route path={`${match.path}/locations`}>
                                        {mapState.info_pane == false ? 
                                        
                                                <StyledQueryWindow query="locations">
                                                    <NotebookLocations />
                                                </StyledQueryWindow>
                                            :
                                                <StyledQueryWindow query="info">
                                                    <NoInfo type="location" />
                                                    <InfoPane occupations={false} locations={true} creators={false}></InfoPane>
                                                </StyledQueryWindow>
                                            }

                                        </Route>

                                        <Route path={`${match.path}/country`}>

                                            {mapState.info_pane == false ? 

                                                <StyledQueryWindow query="country">
                                                    {/* TODO: These props can just be acquired from the MDC useContext in the NotebookCountry Component, they don't need to be props */}
                                                    <NotebookCountry graphs={nationGraphs} updateGraphs={updateNationGraphs} />
                                                </StyledQueryWindow>

                                            : 
                                                
                                                <StyledQueryWindow query="info">
                                                    <NoInfo type="location" />
                                                    <InfoPane occupations={false} locations={true} creators={false}></InfoPane>
                                                </StyledQueryWindow>

                                            }

                                        </Route>

                                    </Switch>
                                </>
                             : null } 

                        <StyledMapWindow id="main-content-wrapper">
                            <NationGraphs graphs={nationGraphs} updateGraphs={updateNationGraphs}/>
                            {props.children}
                        </StyledMapWindow>
                        
                    </div>

                </>
            
            </MapDataContext.Provider>
        </>
    )
}
