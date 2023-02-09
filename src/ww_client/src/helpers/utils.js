// scaleCluster, instead of using D3's Quantize scale or a Quantile scale algo's
// https://github.com/schnerd/d3-scale-cluster -- Optimal ckmeans algorithm implemented with D3
import scaleCluster from 'd3-scale-cluster'

/**
 * Get the URI pathname and search param
 * @param {} nbta 
 * @returns 
 */
export function getReturnTo(nbta){ 

    let back = ""

    switch(nbta) {
        case "occ" : 
            back = "occupations"
            break
        case "loc" :
            back = "locations"
            break
        case "cou" :
            back = "country"
            break
        case "cre" :
            back = "creators"
            break
    }

    // Don't record the location search param
    return {back: back, search: window.location.search}
}

/**
 * Updates our session storage array of the most recently visited IDs
 */
 export function update_recent(type, id) {

    try {

        // Update the array of 10 recently visited counties
        let _recent = JSON.parse(sessionStorage.getItem(type + '_recent'))
    
        if (_recent.recent.length >= 10) {
            _recent.recent.pop()
        }
        
        if (!_recent.recent.includes(id)){
            _recent.recent.unshift(id)
        }

        sessionStorage.setItem(type + '_recent', JSON.stringify({recent: _recent.recent}))

        console.log(`Recent ${type} Array from session:`, JSON.parse(sessionStorage.getItem(type + '_recent')))

    } catch(err) {
        // Session was somehow cleared, Reinitialize recent-ids cache
        if (sessionStorage.getItem('occ_recent') == null) {
            sessionStorage.setItem('occ_recent', JSON.stringify({recent: []}))
        }
        if (sessionStorage.getItem('loc_recent') == null) {
            sessionStorage.setItem('loc_recent', JSON.stringify({recent: []}))
        }
    }

}

export function toggleOpacity (el, hide=false, show=false) {

    // Hide and gtfo
    if (hide) {
        el.classList.remove('fl-fill')
        el.classList.add('no-fill')
        return 0
    }

    // Show and gtfo
    if (show) {
        el.classList.remove('no-fill')
        el.classList.add('fl-fill')
        return 0
    }

    // Toggle
    if (el.classList.contains('no-fill')) {
        el.classList.remove('no-fill')
        el.classList.add('fl-fill')
    } else {
        el.classList.remove('fl-fill')
        el.classList.add('no-fill')
    }
}

/**
 * Mapping of how we order our statistics so that
 * they are consistent every time they are rendered to the map.
 */
export const order = {
    lq  :0,
    pk  :1,
    em  :2,
    col :3,
    rav :4,
    r0  :5,
    r1  :6,
    r2  :7,
    r3  :8,
    r4  :9,
    ex0 : 10,
    ex1 : 11,
    ex2 : 12,
    mhc : 13
}

/**
 * 
 * @param {Object} cDomain - Each statistic's domain
 */
export function scales (cDomain) {

    let minMax = {}
    let scales = {}
    let keys = Object.keys(cDomain)
    let range = {}

    if (keys.length === 2) {
        range = [0,1,2,3,4,5]           // Bivariate Range
        
    } else if (keys.length === 1) {
        range = [0,1,2,3,4,5,6,7,8]     // Monovar Range
    }

    /**
     * These could all be squished into 1 statement.
     * Keeping certain things extensible for now.
     */
    if (cDomain.lq) {
        minMax.lq = [Math.min(...cDomain.lq), Math.max(...cDomain.lq)]
        scales.lq = scaleCluster()
            .domain(cDomain.lq)
            .range(range) 

        // _self.loClusters  = _self.loScale.clusters();    // Just a reminder - not using clustered data for anything just yet
    }
    if (cDomain.pk) {
        minMax.pk = [Math.min(...cDomain.pk), Math.max(...cDomain.pk)]
        scales.pk = scaleCluster()
            .domain(cDomain.pk)
            .range(range)

        // _self.pkClusters  = _self.pkScale.clusters();
    }

    if (cDomain.em) {
        minMax.em = [Math.min(...cDomain.em), Math.max(...cDomain.em)]
        scales.em = scaleCluster()
            .domain(cDomain.em)
            .range(range)

        // _self.emClusters  = _self.emScale.clusters();
    }
    if (cDomain.col) {
        minMax.col = [Math.min(...cDomain.col), Math.max(...cDomain.col)]
        scales.col = scaleCluster()
            .domain(cDomain.col)
            .range(range)

        // _self.emClusters  = _self.emScale.clusters();
    }
    if (cDomain.rav) {
        let filtered_rav = cDomain.rav.filter(function(v){
            if (v == "101.01") {}
            else return v
        })
        minMax.rav = [Math.min(...filtered_rav), Math.max(...filtered_rav)]
        scales.rav = scaleCluster()
            .domain(cDomain.rav)
            .range(range)

        // _self.emClusters  = _self.emScale.clusters();
    }
    if (cDomain.r0) {
        let filtered_r0 = cDomain.r0.filter(function(v){
            if (v == "101.01") {}
            else return v
        })
        minMax.r0 = [Math.min(...filtered_r0), Math.max(...filtered_r0)]
        scales.r0 = scaleCluster()
            .domain(cDomain.r0)
            .range(range)

        // _self.emClusters  = _self.emScale.clusters();
    }
    if (cDomain.r1) {
        let filtered_r1 = cDomain.r1.filter(function(v){
            if (v == "101.01") {}
            else return v
        })
        minMax.r1 = [Math.min(...filtered_r1), Math.max(...filtered_r1)]
        scales.r1 = scaleCluster()
            .domain(cDomain.r1)
            .range(range)

        // _self.emClusters  = _self.emScale.clusters();
    }
    if (cDomain.r2) {
        let filtered_r2 = cDomain.r2.filter(function(v){
            if (v == "101.01") {}
            else return v
        })
        minMax.r2 = [Math.min(...filtered_r2), Math.max(...filtered_r2)]
        scales.r2 = scaleCluster()
            .domain(cDomain.r2)
            .range(range)

        // _self.emClusters  = _self.emScale.clusters();
    }
    if (cDomain.r3) {
        let filtered_r3 = cDomain.r3.filter(function(v){
            if (v == "101.01") {}
            else return v
        })
        minMax.r3 = [Math.min(...filtered_r3), Math.max(...filtered_r3)]
        scales.r3 = scaleCluster()
            .domain(cDomain.r3)
            .range(range)

        // _self.emClusters  = _self.emScale.clusters();
    }
    if (cDomain.r4) {
        let filtered_r4 = cDomain.r4.filter(function(v){
            if (v == "101.01") {}
            else return v
        })
        minMax.r4 = [Math.min(...filtered_r4), Math.max(...filtered_r4)]
        scales.r4 = scaleCluster()
            .domain(cDomain.r4)
            .range(range)

        // _self.emClusters  = _self.emScale.clusters();
    }
    if (cDomain.ex0) {
        let filtered_ex0 = cDomain.ex0.filter(function(v){
            if (v == "101.01") {}
            else return v
        })
        minMax.ex0 = [Math.min(...filtered_ex0), Math.max(...filtered_ex0)]
        scales.ex0 = scaleCluster()
            .domain(cDomain.ex0)
            .range(range)

        // _self.emClusters  = _self.emScale.clusters();
    }
    if (cDomain.ex1) {
        let filtered_ex1 = cDomain.ex1.filter(function(v){
            if (v == "101.01") {}
            else return v
        })
        minMax.ex1 = [Math.min(...filtered_ex1), Math.max(...filtered_ex1)]
        scales.ex1 = scaleCluster()
            .domain(cDomain.ex1)
            .range(range)

        // _self.emClusters  = _self.emScale.clusters();
    }
    if (cDomain.ex2) {
        let filtered_ex2 = cDomain.ex2.filter(function(v){
            if (v == "101.01") {}
            else return v
        })
        minMax.ex2 = [Math.min(...filtered_ex2), Math.max(...filtered_ex2)]
        scales.ex2 = scaleCluster()
            .domain(cDomain.ex2)
            .range(range)

        // _self.emClusters  = _self.emScale.clusters();
    }
    if (cDomain.mhc) {
        let filtered_mhc = cDomain.mhc.filter(function(v){
            if (v == "101.01") {}
            else return v
        })
        minMax.mhc = [Math.min(...filtered_mhc), Math.max(...filtered_mhc)]
        scales.mhc = scaleCluster()
            .domain(cDomain.mhc)
            .range(range)

        // _self.emClusters  = _self.emScale.clusters();
    }

    // console.log("final scales", scales)
    return [scales, minMax]

}


export const fip_to_state = {
    "01":  "alabama",
    "02":  "alaska",
    "04":  "arizona",
    "05":  "arkansas",
    "06":  "california",
    "08":  "colorado",
    "09":  "connecticut",
    "10":  "delaware",
    "11":  "district_of_columbia",
    "12":  "florida",
    "13":  "georgia",
    "15":  "hawaii",
    "16":  "idaho",
    "17":  "illinois",
    "18":  "indiana",
    "19":  "iowa",
    "20":  "kansas",
    "21":  "kentucky",
    "22":  "louisiana",
    "23":  "maine",
    "24":  "maryland",
    "25":  "massachusetts",
    "26":  "michigan",
    "27":  "minnesota",
    "28":  "mississippi",
    "29":  "missouri",
    "30":  "montana",
    "31":  "nebraska",
    "32":  "nevada",
    "33":  "new_hampshire",
    "34":  "new_jersey",
    "35":  "new_mexico",
    "36":  "new_york",
    "37":  "north_carolina",
    "38":  "north_dakota",
    "39":  "ohio",
    "40":  "oklahoma",
    "41":  "oregon",
    "42":  "pennsylvania",
    "72":  "puerto_rico",
    "44":  "rhode_island",
    "45":  "south_carolina",
    "46":  "south_dakota",
    "47":  "tennessee",
    "48":  "texas",
    "49":  "utah",
    "50":  "vermont",
    "51":  "virginia",
    "53":  "washington",
    "54":  "west_virginia",
    "55":  "wisconsin",
    "56":  "wyoming",
    "78":  "virgin_islands"
}