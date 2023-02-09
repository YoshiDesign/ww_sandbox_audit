import { clearMap } from '../../context/utils'

/**
 * All of these functions interact with the data buffers sent to the server
 * 
 * 
 * REFACTOR 11/2021 - I'm removing Bivariate selections outright. The data needs to be normalized before it will
 * display correctly and the indexing needs to be reanalyzed.
 * 
 * 
 * 
 */

function peekFirstButtonStateValue(btn_states) {
    for (let id in btn_states) {
        if (btn_states[id] > 0) {
            return id
        }
    }
    return false
}

function clearButtonStates(btn_states) {
    for (let i in btn_states) {
        btn_states[i] = 0
    }
    return btn_states
}


export function doButtons(el_id, btn_states, mapDispatch) {

    // (Bool) Clicking an active button
    let reset = document.getElementById(el_id).classList.contains('bActive')

    let n = document.getElementsByClassName('bActive');
    for (let i = 0; i < n.length; i++) {
        n[i].classList.remove('bActive')
    }

    if (reset) {
        clearMap()
        mapDispatch({
            type: "NULL_STATS"
        })
        return false
    }

    document.getElementById(el_id).classList.add('bActive')

    for (let id in btn_states) {
        document.getElementById(id).classList.add('deactivate')
    }

    return true

}

/**
 * REFACTORED
 * The effect of selecting up to 2 buttons simultaneously
 * @param {} el_id 
 * @param {*} btn_states 
 */
export function __doButtons(el_id, btn_states) {

    // Detect if we've switched query selections since the last button was pressed. REFACTOR THIS
    let n = document.getElementsByClassName('bActive');
    if (n.length == 0) {
        btn_states = clearButtonStates(btn_states)
    }

    for (let id in btn_states) {
        document.getElementById(id).classList.add('deactivate')
    }
    
    // Deactivate the button and decrement the other if there is another
    if (btn_states[el_id] > 0) {
        btn_states[el_id] = 0
        let check_id = peekFirstButtonStateValue(btn_states)
        if (check_id) {
            btn_states[check_id] = 1
        }
    } else if (btn_states[el_id] === 0) {

        // Cycle the next out
        for (let id in btn_states) {
            if (btn_states[id] === 2) {
                btn_states[id] = 0
            }
        } 

        // find the next button stat to be incremented
        let check_id = peekFirstButtonStateValue(btn_states)
        if (check_id) {
            btn_states[check_id]+=1
        }
        btn_states[el_id] = 1   

    }
    
    for (let id in btn_states) {
        if (btn_states[id] > 0) {
            document.getElementById(id).classList.add('bActive')
        } else {
            document.getElementById(id).classList.remove('bActive')
        }
    }

}

class OccupationStatRequest {

    constructor(args){
        this.query_type = args.query_type
        this.MDC        = args.MDC
        this.actionType = args.actionType
        this.actionSet  = args.actionSet
        this.query_id   = args.query_id
        this.purge      = args.purge   || false
        this.pugeKey    = args.pugeKey || ""
        this.from_id    = args.from_id || ""
    }

}
class CostOfLivingStatRequest {

    constructor(args){
        this.query_type = args.query_type
        this.MDC        = args.MDC
        this.actionType = args.actionType
        this.actionSet  = args.actionSet
        this.query_id   = args.query_id
        this.purge      = args.purge   || false
        this.pugeKey    = args.pugeKey || ""
        this.from_id    = args.from_id || ""
    }

}

// All selectable button ids
export const btn_ids = [
    "ex0",
    "ex1",
    "ex2",
    "pk",
    "lq",
    "em",
    "col",
    "rav",
    "r0",
    "r1",
    "r2",
    "r3",
    "r4",
    "mhc"
]

function deleteKeyAndShift(id, statBuffer) {

    for (let k in statBuffer) {

        // Remove the selection
        if (statBuffer[k] == id) {
            statBuffer[k] = null

            // Organize - shift remaining stat left in the buffer
            if (k == "stat_1" && statBuffer.stat_2 != null) {
                statBuffer.stat_1 = statBuffer.stat_2
                statBuffer.stat_2 = null
            }

        }
    }

    return statBuffer

}

function includesExp(statBuffer) {
    for (let i of Object.values(statBuffer)) {
        if (i.includes("ex")) return true
    }
    return false
}

/**
 * 
 * @param {*} stats 
 * @param {*} key 
 */
export function purgeBuffer (stats, val) {

    for (let k in stats) {
        // Remove val from stats
        if (stats[k] && stats[k].includes(val)){
            stats[k] = null

            // Shift stats left
            if (k == "stat_1" && stats.stat_2 != null) {
                stats.stat_1 = stats.stat_2
                stats.stat_2 = null
            }
        }
    }

    return stats
}

export function hasNull (buffer) {

    try {
        if (buffer instanceof Array)
            return buffer.some( (v) => v == null )
        else if (typeof buffer === "object")
            return Object.values(buffer).some( (v) => v == null )

        throw new TypeError("Invalid argument type [hasNull( Array | Object )]", "statHelper.js")

    } catch (err) {
        console.error("hasNull: ", err)
    }

}

export function allNull (buffer) {

    try{
        if (buffer instanceof Array)
            return buffer.every( (v) => v == null )
        else if (typeof buffer === "object"){
            return Object.values(buffer).every( (v) => v == null )}

        throw new TypeError("Invalid argument type [allNull( Array | Object )]", "statHelper.js")

    } catch (err){
        console.error("allNull: ", err)
    }
    
}

/**
 * Assign a new id to our stat buffer. Data is fetched according to the id's in the stat buffer.
 * Only one job experience stat can be selected at once.
 * @param {*} id 
 * @param {*} stats 
 * @param {*} ex - If experience gauge is enabled, it keeps a permanent seat
 */
export function assignStats (id, stats) {

    /**
     * This function does not need each parameter arranged in any particular order.
     * Organization of the metrics, for deterministic data alignment, occurs
     * after the queried dataset is received.
     */
    let statBuffer = Object.assign({}, stats)
    let curBufferValues = Object.values(statBuffer)

    // This is our first selection
    if (allNull(curBufferValues)) {
        // Add to stat buffer
        statBuffer.stat_1 = id
    }

    // This implies Deactivation - selected id was already in the statbuffer
    else if (curBufferValues.includes(id)) {
        statBuffer = deleteKeyAndShift(id, statBuffer)
    } else {
        statBuffer.stat_2 = statBuffer.stat_1
        statBuffer.stat_1 = id
    }

    for (let id of btn_ids) {
        if (Object.values(statBuffer).includes(id)){
            continue
        } else {
            try {
                document.getElementById(id).classList.remove('bActive')
            } catch (err) {
                // Does not matter. This is strategically saving my sanity atm
            }
        }
    }

    // Reactivate the buttons
    Array.from(document.getElementsByClassName('button-i')).forEach( el => {
        el.classList.remove("deactivate")
    })

    return statBuffer

}
/**
 * Identify if we should be anchoring a salary metric
 * @param {*} stats 
 */
export function hasExperienceStat(stats){
    for (let k in stats) {
        if (stats[k] && stats[k].includes("ex")){
            return true
        }
    }
    return false
}

/**
 * Update the stat buffer and retrieve new datasets. Altering MDC.mapState.stats ultimately determines which buttons are active 
 * Keep in mind that even though we're querying for 2 datapoints, they come from the same
 * dataset, so no matter how many stats occupy the statBuffer, this only makes 1 DB request.
 * TODO - Cacheing the results is just a cool thing to do. Check localstore before punting to the server,
 *        Because I anticipate these metrics to be queried most frequently in the context of WFC data
 * @param {*} requestType 
 * @param {*} statType 
 * @param {*} purge     -- Some stats aren't overlapping by design, e.g. salary info. We don't create a bivariate with 2 salary metrics atm
 * @param {*} purgeKey  -- If stat_n.includes(purgeKey) remove it from the stat_buffer before we do anything
 */
export function alignStats (query_id, statType, stats) {

    // Get the current state of variables
    // let stats = MDC.mapState.stats
    let refetch = 0

    // Determine the stats to be drawn on the map
    stats = assignStats(query_id, stats)

    if (allNull(stats)) {
        // Don't recolor the map, this will remove all colors
        refetch = 0
    }
    else {
        refetch = 1
    }

    // Alter the Map's global state, prompting a FETCH OF NEW DATA based on our selection.
    // The returned data is specifically allocated within its data structure.
    return [stats, refetch]

}


export function sendStatRequest(args) {

    console.log("ARGS")
    console.log(args)

    let req

    switch(args.actionSet) {
        case "WFC" : req = new OccupationStatRequest(args); break;
        case "COL" : req = new CostOfLivingStatRequest(args); break;
    }

    let refetch = 1
    let stats = {stat_1: args.query_id, stat_2: null}

    // Re-render the Legend
    req.MDC.mapDispatch({...req.MDC.mapState, 
        type: "LEGEND_UPDATE", 
        bimono: hasNull(stats) ? "monovar" : "bivariate", 
        atts: Object.values(stats)
    }) 

    // Update and fetch stats
    req.MDC.mapDispatch({
        ...req.MDC.mapState,
        // query_type: req.query_type,
        refetch: refetch,
        type: req.actionType,

        mapdataset : req.actionSet,
        stats: stats,
        v_1: stats.stat_1 || null,
        v_2: null,
    })

    setTimeout(function(){
        // Reactivate the buttons
        Array.from(document.getElementsByClassName('button-i')).forEach( el => {
            el.classList.remove("deactivate")
        })
    }, 200)

}

/**
 * REFACTORED - This supports bivariate selections
 * @param {*} args 
 * @param {*} purge 
 * @returns 
 */
export function __sendStatRequest(args, purge=false) {

    let req

    switch(args.actionSet) {
        case "WFC" : req = new OccupationStatRequest(args); break;
        case "COL" : req = new CostOfLivingStatRequest(args); break;
    }

    // Return a stat buffer and refetch status
    // query_id - the stat's id (ex0,ex1,lq,em,pk,rav_0,rav,mhc.....)
    // stats - {stat_1: null, stat_2: null} the stat buffer
    let [stats, refetch] = alignStats(req.query_id, req.actionSet, req.MDC.mapState.stats)

    if (purge === true) {
        purgeBuffer(stats)
        return 
    }

    // Re-render the Legend
    req.MDC.mapDispatch({...req.MDC.mapState, 
        type: "LEGEND_UPDATE", 
        bimono: hasNull(stats) ? "monovar" : "bivariate", 
        atts: Object.values(stats)
    }) 

    // Update and fetch stats
    req.MDC.mapDispatch({
        ...req.MDC.mapState,
        query_type: req.query_type,
        refetch: refetch,
        type: req.actionType,

        mapdataset : req.actionSet,
        stats: stats,
        v_1: stats.stat_1 || null,
        v_2: stats.stat_2 || null,
    })
    
}