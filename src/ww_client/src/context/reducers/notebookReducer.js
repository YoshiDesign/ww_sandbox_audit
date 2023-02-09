/**
 * This reducer is the map's global state. It effectively:
 * Directs traffic to the server
 * Paints the map
 * Organizes server response data to serve a deterministic layout
 * 
 * It's current limitation is that it does not combine data from multiple sources.
 * The map either displays CoL data, or Wfc data. Combining these is a [ToDo]
 */
export const notebookReducer = (_notebookState, action)  => {

    /**
     * ¡ Caution !
     * Nested switch statement @ "DATA"
     */

    switch(action.type) {

        case "END_LOADING" :
            break;
        default :
            console.log("NO TYPE")
            return {..._notebookState}
    }
}
