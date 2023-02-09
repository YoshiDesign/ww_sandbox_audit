import {titleCase} from '../functional/stringFuncs'
import {fip_to_state} from '../../helpers/utils'



/**
 * Build the typeahead results panel. This is async since we're adding event listeners
 * to each row immediately after.
 * @param {*} searchKey 
 * @param {*} data 
 */
export async function buildResults(searchKey, searchType, data) {

    await (function(){

        var results = Array()
        console.log("Search Key: ", searchKey)
        console.log("search type", searchType)
        console.log("tmp: ")
        console.log(JSON.parse(data))

        // Because I used different keys in the result objects...
        if (searchType == "occ") {
            results = occupation_results(JSON.parse(data))
        }
        if (searchType == "loc") {
            results = location_results(JSON.parse(data))
        }
        if (searchType == "cou") {
            console.log("Country Result -- TODO")
            // results = country_results(JSON.parse(data))
        }
        if (searchType == "cre") {
            results = creator_results(JSON.parse(data))
        }
        var r_list = document.getElementById('TResults')

        console.log("Results", results)

        if (results.length > 0){

            results = sort_results(results, searchKey)
            console.log("rANKED Results: ", results)

            r_list.innerHTML = ""

            for (let r of results) {

                r_list.innerHTML += 
                `<li id="${String("_") + r.id}" class="src-item">${r.str.trim()}
                    <span class="src-result"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18"><path fill="#fff" d="M18 16.5l-5.14-5.18h-.35a7 7 0 10-1.19 1.18v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z"></path></svg></span>
                </li>`

            }
        }

            document.getElementById("TContainer").classList.remove('hide-me')
    
    
    } )()
}

function occupation_results(data){
    let results = Array()
    for (let item of data) {
        var new_result = {id: null, str: null}
        new_result.id = item['occupation_id']
        new_result.str = titleCase(item['title'].split("_").join(" "))
        results.push(new_result)
    }

    return results
}

function location_results(data){
    let results = Array()
    for (let item of data) {
        var new_result = {id: null, str: null}
        let state = titleCase(fip_to_state[item['state']].split("_").join(" "))
        let county = titleCase(item['name'].split("_").join(" "))

        new_result.id = item['fips']
        new_result.str = county + ", " + state
        results.push(new_result)

    }

    return results
}

function creator_results(data){

    for (let _item of data) {

    }

}

// function country_results(data){

//     for (let _item of data) {

//     }

// }

function sort_results (results, term) {

    let ranked_results = []
    
    // Most Relevant
    for (let r of results) {

        let first_word = r.str.split(" ")[0].toLowerCase()

        if (first_word.includes(term.toLowerCase()) && r.v == undefined) {
            ranked_results.push(Object.assign({}, r))
            r.v = 1 // Visited

        }

    }

    // Least Relevant
    for (let r of results) {

        if (r.v == undefined) {
            ranked_results.push(Object.assign({}, r))
            r.v = 1 // Visited
        }

    }

    return ranked_results

}
