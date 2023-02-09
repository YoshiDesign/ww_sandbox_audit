
// Not sure why this is here, unused
export function resetURL()
{
    let url = new URL(window.location.href)
    url.searchParams.delete('page')
    window.history.pushState(
        {additionalInformation: 'The World Works'}, 
        "MapTonic - Creative Economics and Collaboration",
        url.href
    )
}

// Manual pushstate function for page nav
export function updateURLQuery(q, flag, slug=null) {

    if (flag) {
        return
    }

    let url = new URL(window.location)
    // Remove the previous query of this type
    if (slug) {
        url.searchParams.delete(slug)
    }
    console.log("Search Before: ", url.search)
    url.searchParams.append(q['t'], q['id'])
    console.log(q['t'], q['id'])
    console.log("URL Inspect:",{
        pathname: url.pathname,
        search: url.search,

    })

    // Create a new entry in the browser's history
    window.history.pushState({}, q['t'] == "occ" ? "MapTonic: Occupation Search" : "MapTonic: Location Search", url.pathname + url.search)

}

// Return the current URL param's in an object
export function readURLQuery() {

    let url = new URL(document.location.href)

    // WARNING: This implies we cannot read URL queries from the landing page using this function
    if (url.pathname.length === 1)
    {
        return {}
    }

    let query_obj = {}
    for (let i of url.searchParams.keys()) {
        query_obj[i] = url.searchParams.get(i)
    }

    return query_obj
}