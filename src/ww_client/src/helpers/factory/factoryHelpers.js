import { clearMap } from '../../context/utils'
import { sendStatRequest } from '../../helpers/stats/statHelper'

export function addScrolltoNotebook(notebook){
    if (notebook === null) {
        document.getElementById("notebook").classList.add('n-src')
        document.getElementById("notebook").classList.remove('dt-pad')
    } else {
        document.getElementById("notebook").classList.remove('n-src')
        document.getElementById("notebook").classList.add('dt-pad')
    }
}

/**
 * A closure similar to Function.prototype.bind.
 * @param {*} fn 
 * @param  {...any} args 
 */
export function bindToEvent(fn, ...args) {
    return function(e) {
        fn(e, ...args)
    }
}


export function landingPageSelectionToggleEvent(e, state, setState) {

    // Do nothing when active tab is clicked.
    if(e.currentTarget.firstChild.classList.contains('wl-active')) return

    let nbta = e.currentTarget.getAttribute('data-bal').slice(0, 3).toLowerCase()

    setState({...state, notebook_type_abbrev: nbta})

}

/**
 * Set up event listeners to toggle class across our Classified/work/life/create buttons.
 * Is mom's spaghetti. TODO
 * @param {*} el 
 * @param {*} state 
 * @param {*} setState 
 */
export function selectionToggleEvent(e, mapDispatch, nautState, updateNautState) {

    try {

        // Clear the colors and stats
        clearMap(mapDispatch)

        // Clear the search bar
        if (window.innerWidth > 768){
            let searchbar = document.getElementById("main_src")

            if (searchbar)
                document.getElementById("main_src").value = ""
        
        }

    } catch(err) {
        console.error(err)
    }

    let el = e.currentTarget
    console.log("Target: ", e.currentTarget)

    let nbta
    let mapType

    if (el.id === "return_to") {
        console.log("factoryHelpers.js::return_to condition...")
    }

    // The new notebook type abbreviation
    nbta = el.getAttribute('data-bal').slice(0, 3).toLowerCase()

    // Nautilus behavior from clicking the Home button on mobile
    if (nbta == "hom" && window.innerWidth <= 768) {
        if (nautState.lp == false) {
            updateNautState({...nautState, 
                lp:true,
                rp:false,
                naut_open: true,
                left_spin: !nautState.left_spin,
                right_spin: nautState.rp ? !nautState.right_spin : nautState.right_spin,
            })
        }
    }

    switch(nbta) {

        case "cre":
            mapType = "globe"
            break;
        case "loc":
            mapType = "country"
            break;
        case "occ":
            mapType = "country"
            break;
        case "cou":
            mapType = "country"
            break;
        case "hom":
            mapType = "country"
            break;

        default:
            mapType = false

    }
    
    mapDispatch({
        type: "CHANGE_SEARCH",
        info_pane: false,
        notebook_type_abbrev: nbta,
        selections: nbta == "occ" ? 1 : 0,
        // return_to: getReturnTo(nbta),    // please inspect why this was here
        mapType: mapType,
        // also causes loding: true
    })

}

export function showToolTip(id) {
    try {
        document.getElementById(id).classList.remove("hide-me")

    }catch(err){return}
}
export function removeTooltip(id) {
    try {
        document.getElementById(id).classList.add("hide-me")
        
    }catch(err){return}
}