import React, {useEffect, useContext, useState} from 'react'
import { MapDataContext } from '../../../../../../context/MapDataContext'
import SearchBar from '../../../SearchBar'
import  {bindToEvent, selectionToggleEvent} from '../../../../../../helpers/factory/factoryHelpers'

import {
    Link
} from 'react-router-dom'

import { 
    StyledPane,
    StyledSubMenu,
    ButtonOne,
 } from '../../../../../style/styled'

import NotebookOccupations from '../../../../notebook/NotebookOccupations'
import NotebookLocations from '../../../../notebook/NotebookLocations'
import NotebookCreators from '../../../../notebook/NotebookCreators'
import NotebookCountry from '../../../../notebook/NotebookCountry'

/**
 * This component is Mobile-Only
 * 
 * MDC is the MapDataContext. Defined here 
 * and passed to the options which need it
 * 
 * Options are the nautilus's state
 * This could become problematic -- Proceed with caution
 */
const LeftPane = React.memo(function(props){
    
    const MDC = useContext(MapDataContext)

    return ( 
        
        // StyledPane transitions on opacity - no-fill === no opacity
        <StyledPane className={MDC.nautState.lp === true ? " " : "no-fill"} id="left-pane" leftPane >

            {/* Menu Tab Buttons  */}

            <StyledSubMenu id="sSubMenu">

                <Link data-bal={String("Country")}
                    onClick={bindToEvent(selectionToggleEvent, MDC.mapDispatch, MDC.mapState)} id="country-src" 
                    className={String('wl-item ') + String(window.location.href.includes("country") ? " wl-active " : "")} 
                    style={{textDecoration:"none"}} 
                    to={`/map/country${window.location.search}`}>
                    <p className="ln-ht">Economics</p>
                </Link>

                <Link data-bal={String("Occupations")}
                    onClick={bindToEvent(selectionToggleEvent, MDC.mapDispatch, MDC.mapState)} id="work-src"
                    className={MDC.mapState.loading || MDC.mapState.disabledCountries[MDC.mapState.currentCountry] ? "btn-disabled " : "" + MDC.mapState.currentCountry != "" && MDC.mapState.currentCountry != "/world" ? "" : "btn-disabled" } 
                    style={{textDecoration:"none"}} 
                    to={`/map/occupations${window.location.search}`}>
                    <div className={String("wl-item ") + String(window.location.href.includes("occupations") ? " wl-active " : "")}>
                        <p className="ln-ht">Work</p>
                    </div>
                </Link>

                <Link data-bal={String("Locations")}
                    onClick={bindToEvent(selectionToggleEvent, MDC.mapDispatch, MDC.mapState)} id="life-src" 
                    className={MDC.mapState.loading || MDC.mapState.disabledCountries[MDC.mapState.currentCountry] ? "btn-disabled " : "" + MDC.mapState.currentCountry != "" && MDC.mapState.currentCountry != "/world" ? "" : "btn-disabled" }  
                    style={{textDecoration:"none"}} 
                    to={`/map/locations${window.location.search}`}>
                    <div className={String("wl-item ") + String(window.location.href.includes("locations") ? " wl-active " : "")}>
                        <p className="ln-ht">Life</p>
                    </div>
                </Link>

                <Link data-bal={String("Creators")}
                    onClick={bindToEvent(selectionToggleEvent, MDC.mapDispatch, MDC.mapState)} id="create-src"     
                    className={String('wl-item ') + String(window.location.href.includes("creators") ? " wl-active " : "")} 
                    style={{textDecoration:"none"}} 
                    to={`/map/creators${window.location.search}`}>
                    <p className="ln-ht">Creators</p>
                </Link>

            </StyledSubMenu>

            {/* The only difference between each search bar is its ID. Optimize by using state.searchbar AS THE ID */}
            {MDC.mapState.notebook_type_abbrev === "loc" ? 

                <>
                    <SearchBar 
                        mobile={true} 
                        _id="naut_col" 
                        type={MDC.mapState.notebook_type_abbrev.toLowerCase()} 
                        overrideFormClass="mobile-src" 
                        customIDSuffix="-naut" 
                    />
                    <CostOfLivingOptions  /> 
                </>

            : MDC.mapState.notebook_type_abbrev === "occ" ?
                <>
                    <SearchBar
                        mobile={true}
                        _id="naut_wfc"
                        type={MDC.mapState.notebook_type_abbrev.toLowerCase()} 
                        overrideFormClass="mobile-src"
                        customIDSuffix="-naut"
                    />
                    <WorkforceOptions /> 
                </>
            : MDC.mapState.notebook_type_abbrev === "cre" ?
                <>
                    <SearchBar
                        mobile={true}
                        _id="naut_wfc"
                        type={MDC.mapState.notebook_type_abbrev.toLowerCase()} 
                        overrideFormClass="mobile-src"
                        customIDSuffix="-naut"
                    />
                    <CreatorOptions /> 
                </>
            : MDC.mapState.notebook_type_abbrev === "cou" ?
                <>
                  <SearchBar
                        mobile={true}
                        _id="naut_cou"
                        type={MDC.mapState.notebook_type_abbrev.toLowerCase()} 
                        overrideFormClass="mobile-src"
                        customIDSuffix="-naut"
                    />
                    <CountryOptions graphs={MDC.nationGraphs} updateGraphs={MDC.updateNationGraphs} /> 
                </>
            :
                <div>
                    Home
                </div>
            }

        </StyledPane>
    )
})

const CostOfLivingOptions = React.memo( function ({paneState, alignStats}) {

    /**
     * Note: data-stat-type isn't being used currently. This data flow was refactored and was removed from the mapState object
     */

    return (
        <>
            <NotebookLocations></NotebookLocations>
        </>

    )
})

/**
 * MDC is the MapDataContext
 */
export const WorkforceOptions = React.memo( ({paneState, alignStats}) => {

    /**
     * Note: data-stat-type isn't being used currently. This data flow was refactored and was removed from the mapState object
     */

    return (
        <>
            <NotebookOccupations></NotebookOccupations>
        </>
    )
})

/**
 * MDC is the MapDataContext
 */
export const CreatorOptions = React.memo( ({paneState, alignStats}) => {

    /**
     * Note: data-stat-type isn't being used currently. This data flow was refactored and was removed from the mapState object
     */

    return (
        <>
            <NotebookCreators></NotebookCreators>
        </>
    )
})

export const CountryOptions = React.memo( ({graphs, updateGraphs}) => {

    /**
     * Note: data-stat-type isn't being used currently. This data flow was refactored and was removed from the mapState object
     */

    return (
        <>
            <NotebookCountry graphs={graphs} updateGraphs={updateGraphs}></NotebookCountry>
        </>
    )
})

export default LeftPane