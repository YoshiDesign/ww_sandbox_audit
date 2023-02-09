
/**
 * Extract the county names and map them to their states in an object from which we 
 * can reference names textually
 * @param {*} data 
 */
export default function buildMapTools(data) {

    const states = {
        "01":"AL",
        "02":"AK",
        "04":"AZ",
        "05":"AR",
        "06":"CA",
        "08":"CO",
        "09":"CT",
        "10":"DE",
        "11":"DC",
        "12":"FL",
        "13":"GA",
        "15":"HI",
        "16":"ID",
        "17":"IL",
        "18":"IN",
        "19":"IA",
        "20":"KS",
        "21":"KY",
        "22":"LA",
        "23":"ME",
        "24":"MD",
        "25":"MA",
        "26":"MI",
        "27":"MN",
        "28":"MS",
        "29":"MO",
        "30":"MT",
        "31":"NE",
        "32":"NV",
        "33":"NH",
        "34":"NJ",
        "35":"NM",
        "36":"NY",
        "37":"NC",
        "38":"ND",
        "39":"OH",
        "40":"OK",
        "41":"OR",
        "42":"PA",
        "72":"PR",
        "44":"RI",
        "45":"SC",
        "46":"SD",
        "47":"TN",
        "48":"TX",
        "49":"UT",
        "50":"VT",
        "51":"VA",
        "53":"WA",
        "54":"WV",
        "55":"WI",
        "56":"WY",
        "78":"VI"
    }

    let mapTools = {}
    for (let item of data) {

        // The first 2 digits of a county's FIPS make up its state-id
        let state = states[item.id.slice(0,2)]
        mapTools[item.id] = {
            n: item.properties.name,
            s: state
        }
    }
    
    return mapTools

}