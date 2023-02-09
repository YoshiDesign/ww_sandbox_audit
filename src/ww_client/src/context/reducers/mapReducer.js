/**
 * This reducer is the map's global state. It effectively:
 * Directs traffic to the server
 * Paints the map
 * Organizes server response data to serve a deterministic layout
 * 
 * It's current limitation is that it does not combine data from multiple sources.
 * The map either displays CoL data, or Wfc data. Combining these is a [ToDo]
 */
export const mapReducer = (_mapState, action)  => {

    /**
     * ¡ Caution !
     * Nested switch statement @ "DATA"
     * action.type >>> action.mapdataset
     */

    switch(action.type) {

        // case "HANDLE_PANE":

        //     return {
        //         ...nautState,
        //         rp: action.rp,
        //         lp: action.lp,
        //         // The info pane is handled by the MDC, not the NSC. This is because it is shared between desktop and mobile
        //         left_spin: action.left_spin,
        //         right_spin: action.right_spin,
        //         naut_open: action.naut_open
        //     }

        case "HANDLE_PANE_INFO":
            /**
             * The mapDataContext is responsible for the info Pane
             * This is because do-datamap.js influences it
             */
            return {
                ..._mapState,
                info_pane: action.info_pane,
            }

        case "MAPDATASET" : 
            
            return {
                ..._mapState,
                mapdataset: action.mapdataset
            }

        case "SET_WINDOW_SIZE":

            return {
                ..._mapState,
                mobile: action.mobile
            }

        case "END_LOADING" :
            return {
                ..._mapState, 
                mapType: action.mapType || _mapState.mapType, // Use with caution
                loading: false,
            }

        case "MDC_INIT_APP" :

            return {
                ..._mapState,
                // loading: false,
                mobile:  action.mobile,
                mapType: action.mapType,
                info_pane: action.info_pane,
                currentCountry: action.currentCountry,
                currentCountryTitle: action.currentCountryTitle,
                notebook_type_abbrev: action.notebook_type_abbrev || _mapState.notebook_type_abbrev

            }

        case "LEGEND_UPDATE" :

            return {
                ..._mapState,
                atts: action.atts,
                bimono: action.bimono
            }

        case "DATA" :

            switch(action.mapdataset) {

                // Acquire Cost of Living Dataset
                case "COL" :

                    return {
                        ..._mapState,
                        refetch: action.refetch,
                        v_1 : action.v_1, 
                        v_2 : action.v_2, 
                        _url : '/api/datas/col',
                        stats : action.stats
                    }

                // Acquire Workforce datasets
                case "WFC" : 

                    return {
                        ..._mapState,
                        refetch: action.refetch,
                        v_1 : action.v_1, 
                        v_2 : action.v_2, 
                        occ_code: action.occ_code, 
                        _url : '/api/datas/wfc',
                        stats : action.stats
                    }

            }
            break

        case "RESET_BUTTON_DATA" :

            return {
                refetch: 0,
                v_1 : null, 
                v_2 : null
            }

        case "COLOR" :
            console.log("Color Reducer")
            return {..._mapState, color_swatch: action.color_swatch, refetch: 0}
        
        case "RST" :

            // Reset Stats and things, this is not meant to clean up memory
            // E.g. Do not: 
            //      theMap: null
            // here

            return {
                ..._mapState,
                mobile: action.mobile,
                refetch: 0,
                v_1: null,
                v_2: null,
                stats : {
                    stat_1: null,
                    stat_2: null,
                },
                notebooks: {
                    occ_notebook: null,
                    loc_notebook: null,
                    cre_notebook: null,
                }
            }

        case "CLEAN" :

            return {
                ..._mapState,
                data: null,
                cDomain: null,
            }

        case "NAUTILUS" :

            return {
                ..._mapState,
                moveNautilus : true,
                shouldInfoPaneBeOpen : action.shouldInfoPaneBeOpen
            }

        case "CACHE" :

            return {
                ..._mapState,
                cDomain: action.cDomain,
                data: action.data,
                sortKeys: action.sortKeys,
                colorScales: action.colorScales,
                loading:false
            }

        case "NULL_STATS" : 

            return {
                ..._mapState,
                stats : {
                    stat_1: null,
                    stat_2: null,
                }
            }

        // User selected a search suggestion
        case "SELECT_QUERY":
            console.log("Selected QUery w Info Pane: ", action.info_pane)
            return {
                ..._mapState,
                selections: _mapState.selections + action.selections,   // being explicit...  action.selections could be replaced with ++_mapState.selections
                no_info: false,
                refetch: action.refetch,
                info_pane: action.info_pane,
                new_location: action.new_location ? action.new_location : _mapState.new_location,
                new_occupation: action.new_occupation ? action.new_occupation : _mapState.new_occupation,
            }

        case "UPDATE_NOTEBOOK" :
            /**
             *  We never update more than 1 notebook simultaneously 
             */
            if (action.occ_notebook) {
                // console.log("Updating occupation notebook from reducer.")
                return {
                    ..._mapState,
                    notebooks: {..._mapState.notebooks, occ_notebook: action.occ_notebook, no_info: false},
                    notebook_type_abbrev: action.nbta
                }
            }
            else if (action.loc_notebook) {
                // console.log("Updating location notebook from reducer.")
                return {
                    ..._mapState,
                    notebooks: {..._mapState.notebooks, loc_notebook: action.loc_notebook, no_info: false},
                    notebook_type_abbrev: action.nbta
                }
            }
            else
                return

        case "UPDATE_COUNTRY" :

            return {
                ..._mapState,
                currentCountry: action.currentCountry,
                currentCountryTitle: action.currentCountryTitle,
                mapType: action.mapType,
                notebook_type_abbrev: action.notebook_type_abbrev || _mapState.notebook_type_abbrev
            }

        case "SET_NATION_STATS" :

            return {
                ..._mapState,
                current_nation_stats : action.nationStats
            }

        case "RESET_MOBILE_HOME":
            // All this serves to do is activate/deactivate the style of the Home button based on the nbta
            return {
                ..._mapState,
                // Don't change anything unless we're at /map/home. This preserves the state of the left pane
                notebook_type_abbrev: window.location.pathname == "/map/home" ?  "" : _mapState.notebook_type_abbrev,
            }

        case "ACTIVATE_MOBILE_HOME":
            
            return {
                ..._mapState,
                notebook_type_abbrev: "hom",
            }

        // Toggling different searches
        case "CHANGE_SEARCH":

            // Changing the search should remove "loc" from the query parameters - as in, changing the search closes the info pane
            let url = new URL(window.location)
            if (url.search.includes("loc=")) {
                url.searchParams.delete("loc")
                window.history.pushState({}, "", url.pathname + url.search)
            }

            return {
                ..._mapState,
                loading: (!_mapState.loading) && (action.mapType == _mapState.mapType) ? false : true,
                info_pane: action.info_pane,
                notebook_type_abbrev: action.notebook_type_abbrev,
                return_to: action.return_to,
                mapType: action.mapType,
                selections: action.selections ? _mapState.selections + action.selections : _mapState.selections
            }

        /**
        * Small but incredibly important. This adds the class, that is the map itself, to the MDC.
        * This way we can call methods on it from MDC.mapState.theMap
        */
        case "ADD_THE_MAP":

            return {
                ..._mapState,
                theMap: action.theMap,
                mapType: action.mapType
            }

        case "NO_INFO":
            return {
                ..._mapState,
                no_info: true
            }

        default :
            return _mapState

    }
}