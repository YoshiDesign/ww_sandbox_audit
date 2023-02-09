import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { debounce } from '../../utils/utils'
import { getReturnTo, update_recent } from '../../../helpers/utils'
import { updateURLQuery } from '../../../helpers/functional/windowHistory'
import { selectionToggleEvent, bindToEvent } from '../../../helpers/factory/factoryHelpers'
import { buildResults } from '../../../helpers/search/searchResultHelpers'
import { MapDataContext } from '../../../context/MapDataContext'

import {
    SearchInput,
    SearchSVG
} from '../../style/styled'
import {
    Link
  } from "react-router-dom";

/**
 * Used to translate state abbreviations into strings
 */
 export const searchConventions = {
    "loc" : "for a County",  // Appears as searchbar placeholder
    "occ" : "for Occupation Titles",          // Appears as searchbar placeholder
    "cre" : "for Creators",              // Appears as searchbar placeholder
    "cou" : "for Countries"
}

const DEBOUNCE_INTERVAL = 150

/**
 * Don't memoize this component, it needs to be optimized first.
 * @vars searchKey, searchType, are indicative of anti-patterns. This was to speed up development.
 * @param {*} props 
 * @returns 
 */
const SearchBar = function(props){ 

    const MDC = useContext(MapDataContext)

    var searchKey = ""
    var searchType = ""

    /**
     * Searchbar input onChange event listener.
     * Debounces - The event will not fire unless DEBOUNCE_INTERVAL has elapsed
     */
    var tSearch = debounce( function() {

        let match = /^[A-Za-z \'.]*$/.test(searchKey.trim())

        if (searchKey.trim() == "" || !match){
            return 0
        }

        // Entirely necessary
        let searchKeys = searchKey.split(' ')
        searchKey = searchKeys.join('_')

        console.log("MDC Mapstate:", MDC)

        axios.get(`/api/datas/instant?query=${searchKey.toLowerCase().trim()}&b=${searchType}&n=${MDC.mapState.currentCountry}` , {}, {
            proxy: {
                host: 'localhost',
                port: 4000
            }
        }).then( (res) => {

            console.log('INSTANT RESPONSE')
            console.log(res.data)

            buildResults(searchKey, searchType, res.data.results).then( () => {

                // Listeners for the results - Both of these functions are in this Fcomponent
                makeListHoverListeners(document.getElementsByClassName('src-item'))
                makeListClickListeners(document.getElementsByClassName('src-item'))

            }).catch( err => {
                console.log("Failed to generate search results.")
                console.log(err)
                var r_list = document.getElementById('TResults')
                document.getElementById("TContainer").classList.remove('hide-me')
                r_list.innerHTML = `<li class='src-item'>No results...</li>`
                
            })
            
        }).catch( err => { 
            console.error(err) 

        })
    }, DEBOUNCE_INTERVAL)

    /**
     * @EventListeners
     * Clicking on suggestion - punt to server via selectQueryListItem()
     */
    function makeListClickListeners(list) {
        Array.from(list).forEach( el => {
            el.addEventListener('click', bindToEvent(selectQueryListItem, el.id, el.textContent))
        })
    }

    function makeListHoverListeners(list) {
        Array.from(list).forEach( el => {
            el.addEventListener('mouseenter', e => {
                e.target.classList.add('src-item-active')
            })
            el.addEventListener('mouseout', e => {
                e.target.classList.remove('src-item-active')
            })
        })
    }

    function dispatchSelection(slug, _id, flag){
        let url = new URL(window.location)

        console.log("DispatchSelection:URL Search == ", url.search)

        let new_loc = null
        let new_occ = null
        let new_cre = null
        let new_query_obj = {}

        if (!flag) {
            new_query_obj['id'] = _id
            new_query_obj['t']  = slug
        }

        switch (slug) {
            case "loc" : 
                new_loc = _id
                new_occ = null
                new_cre = null
                break;
            case "occ" : 
                new_loc = null
                new_cre = null
                new_occ = _id
                break;
            case "cre" : 
                new_loc = null
                new_cre = _id
                new_occ = null
                break;
        }

        let new_dispatch = {
            ...MDC.mapState,
            type: "SELECT_QUERY",
            info_pane: new_loc ? true : false,    // This will open the info pane when locations are selected from the searchbar
            selections: 1,
            notebook_type_abbrev: slug,
            new_location: new_loc,
            new_occupation: new_occ,
            new_creator: new_cre,
            refetch: 1,
            return_to: getReturnTo(slug),
            _url: "/api/datas/" + slug,
        }

        // Update the applicable most-recent-selections array
        update_recent(slug, _id)
        
        // Update History from latest query
        updateURLQuery(new_query_obj, flag, slug)
        console.log("Searchbar::SELECT_QUERY(dispatch)")
        MDC.mapDispatch(new_dispatch)

    }

    // Set the searchbar's value to `title`
    function pasteSearchSelection(title) {
        
        try {
            if (title) document.getElementById(props._id).value = title
            else {
    
                // Grab it from somewhere else. Temporary code placement for this sort of behavior. It means we're traversing here from the landing page after selecting a search result
                setTimeout(function(){
                    try{
                        let n = document.getElementById('m_title').textContent
                        if (n == "National Statistics") document.getElementById(props._id).value = null
                        else
                            document.getElementById(props._id).value = document.getElementById('m_title').textContent
                    } catch(err){

                    }
                }, 1000)
    
            }

        } catch (err) {

            // This is the 2nd of 2 try/catch for this function. Just being stupid careful

        }
        
    }

    /** 
     * @EventListenerCallback when search result is clicked
     * Get the queried results and update "global" state
     * 
     * Cache the most recent query item.
     * 
     * Flag indicates page initialization. TODO Audit that
     */
    function selectQueryListItem (_e, _id, title, flag=0) {
        
        // Paste the selection into the searchbar
        if (title) {
            try {
                document.getElementById('main_src').value = title
            } catch(err){}
        }

        let n = document.getElementsByClassName('button-i')
        if (n) {
            for (let i = 0; i < n.length; i++) {
                n[i].classList.remove('bActive')
            }
        }

        if (_e) {
            _e.preventDefault()
        }

        if (!flag) {
            _id = _id.split("_")[1]
        }

        // Hide the result list
        document.getElementById('TContainer').classList.add('hide-me')

        try {
            if (MDC.mapState.theMap != null) {
                MDC.mapState.theMap.reset()
            }
        } catch (err) {}

        // Determines which api route is activated
        var uri_slug = searchType.slice(0, 3)

        dispatchSelection(uri_slug, _id, flag)

    }

    function reportDisabledCountry() {
        // Tooltip that says we have no datas
        if (MDC.mapState.disabledCountries[MDC.mapState.currentCountry]) {
            console.log("Disabled Country is disabled")
        }
    }

    function blurSearchBar(e){
        if(Array.from(document.getElementsByClassName('src-item-active')).length > 0) {
            // List is open - This works in tandem with TResult's evt listener. Both are not necessary but allow for more operational channels
        } else {
            // Hide the results
            document.getElementById('TContainer').classList.add('hide-me')
        }
    }

    /**
     * The search bar's keyup event listener
     * @param {SyntheticEvent} e 
     */
    function searching (e) {

        e.preventDefault()
        searchKey = e.target.value
        let last_char = e.target.value[e.target.value.length - 1]
        let valid_char = /[A-Za-z'.-]/

        // User deleted the search. Beginning search w blank space will also == true
        if (searchKey.trim() == "" && !document.getElementById("TContainer").classList.contains('hide-me')) {
            document.getElementById("TContainer").classList.add('hide-me')
            return 0
        }

        // Last character was a space, don't send a new request
        if (!valid_char.test(last_char)/* (!state.type)*/ ) {
            return 0
        }

        try {

            // Update our global var. This is a global bc tSearch is a closure and binding vars to it doesn't support extensibility at the moment
            searchType = MDC.mapState.notebook_type_abbrev

        } catch (err) {
            console.log(err)
            return 0
        }

        // Generate suggestions
        tSearch()

    }

    useEffect( () => {

        try {

            let nbta = null
            let work = document.getElementById('work-src').classList.contains('wl-active')
            let country = document.getElementById('country-src').classList.contains('wl-active')
            let life = document.getElementById('life-src').classList.contains('wl-active')
            let create = document.getElementById('create-src').classList.contains('wl-active')
    
            if      (work)          nbta = "occ"
            else if (country)       nbta = "cou"
            else if (life)          nbta = "loc"
            else if (create)        nbta = "cre"
    
            props.set_help_state({
                ...props.help_state,
                notebook_type_abbrev: nbta
            })

        } catch(err) {
            // We're on the landing page
        }

        /**
         * Immediately execute a search if there is a query parameter in the URI
         * */ 
        if (window.location.pathname !== "/" && window.location.search) {

            let query_id
            let url = new URL(window.location)
            let occ_query = url.searchParams.get('occ')
            let loc_query = url.searchParams.get('loc')
            let cre_query = url.searchParams.get('cre')

            // if / else if -- implies we'll only ever query one thing
            if (occ_query) {
                searchType = "occupation"
                query_id = occ_query
            }
            else if (loc_query) {
                searchType = "location"
                query_id = loc_query
            }
            else if (cre_query) {
                searchType = "creator"
                query_id = cre_query
            }

            // Exactly the same as making a search selection but generated from the URL QueryParam
            // selectQueryListItem(null, query_id, null, 1)

        }

    }, [])

    return (
        <>
            {props.children}
            { props.mobile ? 
                // Mobile Interface searchbar
                <>
                 { MDC.mapState.notebook_type_abbrev == "cou" ? 
                    null
                 : 
                    <>
                        <SearchInput autoComplete="off" onBlur={blurSearchBar} onChange={searching} mobile={props.mobile} id={props._id} placeholder={String("Search ") + searchConventions[props.type] + "..."} type="text" aria-controls="top-search" className={String("searchbar searchbar-mobile _src") }/>
                        <SearchSVG mobile={props.mobile} aria-hidden="true" width="18" height="18" viewBox="0 0 18 18"><path fill="#ccc" d="M18 16.5l-5.14-5.18h-.35a7 7 0 10-1.19 1.18v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z"></path></SearchSVG>
                    </>
                 }
                </>
            : null}

            {/* Helper Searchbar - Appears atop the page with the map */}
            { props.helper ?

                <>
                    {/* Country / Work / Life / Creator buttons */}
                    <div className={String("wl ") + props.wlClass}>
                        <Link 
                            data-bal={String("Country")}  
                            onClick={bindToEvent(selectionToggleEvent, MDC.mapDispatch, MDC.mapState)} 
                            style={{textDecoration:"none", flex:1}} 
                            className={MDC.mapState.loading ? "btn-disabled " : ""}
                            to={`/map/country${window.location.search}`}
                        >
                            <div id="country-src" className={String('wl-item ') + String(MDC.mapState.notebook_type_abbrev == "cou" ? " wl-active" : false)}>

                                <p className="ln-ht">Economics</p>

                            </div>
                        </Link>
                        {MDC.mapState.notebook_type_abbrev == "cou" || MDC.mapState.notebook_type_abbrev == "occ" || MDC.mapState.notebook_type_abbrev == "loc" || (MDC.mapState.notebook_type_abbrev == "cre" && MDC.mapState.currentCountry !== "/world") || (MDC.mapState.notebook_type_abbrev == "hom" && MDC.mapState.currentCountry !== "/world") ?
                        <>
                            <Link 
                                data-bal={String("Occupations")} 
                                onClick={bindToEvent(selectionToggleEvent, MDC.mapDispatch, MDC.mapState)} 
                                style={{textDecoration:"none", flex:1}} 
                                className={MDC.mapState.loading || MDC.mapState.disabledCountries[MDC.mapState.currentCountry] ? "btn-disabled " : "" + MDC.mapState.currentCountry != "" && MDC.mapState.currentCountry != "/world" ? "" : "btn-disabled" } 
                                to={`/map/occupations${window.location.search}`}
                            >
                                <div id="work-src" className={String('wl-item ') + String(MDC.mapState.notebook_type_abbrev == "occ" ? " wl-active" : false)}>

                                    <p className="ln-ht">Work</p>

                                </div>
                            </Link>
                            <Link 
                                data-bal={String("Locations")} 
                                onClick={bindToEvent(selectionToggleEvent, MDC.mapDispatch, MDC.mapState)} 
                                style={{textDecoration:"none", flex:1}} 
                                className={MDC.mapState.loading || MDC.mapState.disabledCountries[MDC.mapState.currentCountry] ? "btn-disabled " : "" + MDC.mapState.currentCountry != "" && MDC.mapState.currentCountry != "/world" ? "" : "btn-disabled"} 
                                to={`/map/locations${window.location.search}`}
                            >
                                <div id="life-src" className={String('wl-item ') + String(MDC.mapState.notebook_type_abbrev == "loc" ? " wl-active" : false)}>

                                    <p className="ln-ht">Life</p>

                                </div>
                            </Link>
                        </>
                        : null }
                        <Link 
                            data-bal={String("Creators")}  
                            onClick={bindToEvent(selectionToggleEvent, MDC.mapDispatch, MDC.mapState)} 
                            style={{textDecoration:"none", flex:1}} 
                            className={MDC.mapState.loading ? "btn-disabled " : ""} 
                            to={`/map/creators${window.location.search}`}
                        >
                            <div id="create-src" className={String('wl-item ') + String(MDC.mapState.notebook_type_abbrev == "cre" ? " wl-active" : false)}>

                                <p className="ln-ht">Creators</p>

                            </div>
                        </Link>
                    </div>
                    {  MDC.mapState.notebook_type_abbrev == "hom" ||  MDC.mapState.notebook_type_abbrev == "cou" ? 
                            <>
                                <div style= {{
                                    minWidth: "195px",
                                    display: "flex",
                                    alignItems: "center"
                                }}>
                                    
                                    <p style={{
                                            color: "grey",
                                            fontSize: "12px",
                                            pointerEvents: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            margin: "3px",
                                        }
                                    }>
                                        
                                        {  MDC.mapState.notebook_type_abbrev == "hom" ? 
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="35x35" fill="currentColor" width="22" height="22" focusable="false">
                                                    <path d="M11 1L6.39 8 11 15H8.61L4 8l4.61-7z"></path>
                                                </svg>
                                                <span>
                                                    Select a country or a category
                                                </span>
                                            </>
                                        : MDC.mapState.notebook_type_abbrev == "cou" ?
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="35x35" fill="currentColor" width="39" height="39" focusable="false">
                                                    <path d="M11 1L6.39 8 11 15H8.61L4 8l4.61-7z"></path>
                                                </svg>
                                                <span>
                                                    The Work and Life categories will become available if there is enough data for the country you select
                                                </span>
                                            </>  
                                        : null

                                        }
                                    </p>
                                </div>
                            </>

                        :

                            <div>
                                {/* Primary Desktop Searchbar */}
                                <SearchInput autoComplete="off" onBlur={blurSearchBar} onChange={searching} helper={props.helper} placeholder={String("Search ") + searchConventions[MDC.mapState.notebook_type_abbrev] + "..."} type="text" id="main_src" aria-controls="top-search" className={props.classes + String(" _src")}/>
                                <SearchSVG helper={props.helper} mobile={props.mobile} aria-hidden="true" width="18" height="18" viewBox="0 0 18 18"><path fill="#ccc" d="M18 16.5l-5.14-5.18h-.35a7 7 0 10-1.19 1.18v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z"></path></SearchSVG>
                            </div>

                    }
                    
                </>
            : null }

            {/* Separate results containers */}
            {props.mobile ? 
                <>
                    <div id="TContainer" className={String("results rlist hide-me mobile-results ") + String(props.mobile ? " results-mobile" : "")}>
                        <ul id="TResults">

                        </ul>
                    </div>
                </>
            : null }

            {props.helper ? 
                <>
                    <div id="TContainer" className={String("results rlist hide-me helper-results ") + String(props.mobile ? " results-mobile" : "")}>
                        <ul id="TResults">

                        </ul>
                    </div>
                </>
            
            : null }

        </>
    ) 
}

export default SearchBar