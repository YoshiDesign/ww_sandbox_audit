import {titleCase, normalString} from '../helpers/helpers'

export function makeLocalCompaniesList(data) {

    console.log("Local Companies List...")

    var topCompaniesList = document.getElementById("topComp")
    let li = document.createElement("LI")
    li.classList.add('a-list')
    li.classList.add('tb-mar-s')

    topCompaniesList.innerHTML = ""

    if ( !data || data.places.length == 0) {
        li.innerText = "No listings are available yet."
        topCompaniesList.appendChild(li)
        return 0
    }

    for (let i in data.places) {
        if (!data.places[i].match(/^[0-9a-z\w'" .()]+$/))
            continue

        let list_item = li.cloneNode(true)
        list_item.innerText = titleCase(normalString(data.places[i]))
        topCompaniesList.appendChild(list_item)

    }

    console.log("Companies list completed!")

}
export function makeSchoolsList(schools){
    console.log("School")
    console.log(schools)
    var school_list = document.getElementById('schools')

    // TODO!!!!!!!!!

}

// This is a lookup table...
// And it should just be an object...
// There are no excuses here
export function getKeyTitle(k) {
    switch (k) {
        case "lq":
            return "Location Quotient"
        case "pk":
            return "Jobs / 1000"
        case "em":
            return "Total Employed"
        case "ex0":
            return "Newbie"
        case "ex1":
            return "Associate"
        case "ex2":
            return "Senior"
        case "rav":
            return "Avg. Rent"
        case "mhc":
            return "Median Home Cost"
        case "col":
            return "Cost of Living"
        case "r0":
            return "Studio Apartment"
        case "r1":
            return "1 Br. Apartment"
        case "r2":
            return "2 Br. Apartment"
        case "r3":
            return "3 Br. Apartment"
        case "r4":
            return "4 Br. Apartment"
   }
}

// export function makeInfoStats(data, fips) {


// }