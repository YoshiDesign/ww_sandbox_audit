import React, { useEffect, useState, useContext } from 'react';
import SearchBar from './mains/navigator/SearchBar'
import UserPane from './mains/navigator/UserPane'
// import { getReturnTo } from '../helpers/utils'
import HomeButton from './HomeButton'
import { bindToEvent, selectionToggleEvent } from '../helpers/factory/factoryHelpers'
import { 
    StyledSecondaryNavbar,
} from './style/styled';
import { MapDataContext } from '../context/MapDataContext';

export default function HelperBar () {

    const MDC = useContext(MapDataContext)

    return (
        
        <StyledSecondaryNavbar className="navi">

            <nav className="navi secondary">

                <>

                    <form role="search" className="w100">
                        <div className="helper-search">
                            {/* <div className="pos-rel grid"> */}

                                

                                {window.innerWidth > 768 ? 

                                    <SearchBar 
                                        helper={true} 
                                        mobile={false} 
                                        _id="main_src"
                                        // help_state={state}
                                        // set_help_state={setState}
                                        nType={false}  // This is only relevant to mobile
                                        classes=" alt-border pos-abs mg-src "   // classes
                                        overrideFormClass=" w100 "              // classes
                                        wlClass=" longer "                      // classes
                                        wlc=" wlc "                             // classes...
                                    >

                                        <HomeButton event_func={bindToEvent(selectionToggleEvent, MDC.mapDispatch, MDC.nautState, MDC.updateNautState)} notebook_type_abbrev="hom" />
                                        
                                    </SearchBar>
                                    
                                : 

                                    <HomeButton event_func={bindToEvent(selectionToggleEvent, MDC.mapDispatch, MDC.nautState, MDC.updateNautState)} notebook_type_abbrev="hom" />
                                    
                                }
                            {/* </div> */}

                        </div>
                    </form>
                    <div className="helper-usr">
                        <UserPane></UserPane>
                    </div>
                </>

            </nav>

        </StyledSecondaryNavbar>
    )
}