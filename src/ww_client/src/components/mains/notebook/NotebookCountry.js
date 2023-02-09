import React, {useEffect, useContext, useState} from 'react'
import { MapDataContext } from '../../../context/MapDataContext'
import { data_series_lookup_table, countries, countries_title, selectCountry } from '../../../components/Maps/utils/utils'
import {
    NotebookSection,
    NotebookSegment,
    NotebookHeader,
    NotebookParagraph,
    StyledSearchSelect,
    CategoryHeading
} from '../../style/styled'

const GRAPH_LIMIT = 9
// these correspond with the `fills` in do-NationGraph2
const colors = ["#ff595e7d", "#ffca3a7d", "#8ac9267d", "#1982c47d", "#6a4c937d", "#f725857d", "#f3722c7d", "#38b0007d", "#4cc9f07d", "#b5179e7d"]
// const CATEGORY_ORDER = ["1", "2", "3", "5", "6", "7"]

/**
 * README -
 * 
 * - The user selects a country.
 * - Check if (sessionStorage['currentCountry']['key'] == the selected <option> value)
 * - The value of the <option> is the Redis Key that contains the country's SVG code.
 * - If it's not in sessionStorage already, fetch the SVG and set the MDC.mapState's currentCountry to the value of the <option>
 * - Store the retrieved SVG in sessionStorage['currentCountry']['key']
 * - Store the retrieved SVG's code in sessionStorage['currentCountry']['svg']
 * 
 * Note that we're only ever storing the current SVG in sessionStorage. Navigating to the [Country] tab shouldn't
 * immediately invoke a call to the API.
 */

function isApercent(s) {

    return s.indexOf("percent") != -1 || s.indexOf("%") != -1

}

/**
 * Find the most recent stat in the time-series data. Not every timeline is exhaustive
 * @param {*} item 
 * @returns 
 */
function mostRecentStat(item) {

    let most_recent_val  = null
    let most_recent_year = null

    for (let index in item.data) {
        if (item.data[index] != ""){
            most_recent_val = parseInt(item.data[index])
            most_recent_year = index
        }
    }

    return [most_recent_val, most_recent_year]
    
}

function NotebookCountry({graphs, updateGraphs}) {

    const MDC = useContext(MapDataContext)
    const [ix_count_1, setIxCount1] = useState(0)
    const [ix_count_2, setIxCount2] = useState(0)
    const [ix_count_3, setIxCount3] = useState(0)
    const [ix_count_4, setIxCount4] = useState(0)
    const [ix_count_5, setIxCount5] = useState(0)
    const [ix_count_6, setIxCount6] = useState(0)
    const [ix_count_7, setIxCount7] = useState(0)
    const [mapTitle, setMapTitle] = useState("World")
    const [searchOpen, setSearchOpen] = useState(false)
    const [c1_showLess, setC1_showLess] = useState(true)
    const [c2_showLess, setC2_showLess] = useState(true)
    const [c3_showLess, setC3_showLess] = useState(true)
    const [c4_showLess, setC4_showLess] = useState(true)
    const [c5_showLess, setC5_showLess] = useState(true)
    const [c6_showLess, setC6_showLess] = useState(true)
    const [c7_showLess, setC7_showLess] = useState(true)

    // ix_count things are used for the "show more" selection
    const setIx = {
        "1" : [ix_count_1, setIxCount1],
        "2" : [ix_count_2, setIxCount2],
        "3" : [ix_count_3, setIxCount3],
        "4" : [ix_count_4, setIxCount4],
        "5" : [ix_count_5, setIxCount5],
        "6" : [ix_count_6, setIxCount6],
        "7" : [ix_count_7, setIxCount7],
    }

    const setShowMoreStats = {
        "c1" : [c1_showLess, setC1_showLess],
        "c2" : [c2_showLess, setC2_showLess],
        "c3" : [c3_showLess, setC3_showLess],
        "c4" : [c4_showLess, setC4_showLess],
        "c5" : [c5_showLess, setC5_showLess],
        "c6" : [c6_showLess, setC6_showLess],
        "c7" : [c7_showLess, setC7_showLess],
    }

    /**
     * graphs and updateGraphs() are from the MDC (context provider). It's a useState() of the <MapDataProvider> - update the graphs we're currently rendering.
     */
    function addToGraph(e) {

        // Limit of 10 graphs
        if (graphs.length >= GRAPH_LIMIT) return;
 
        if (graphs.indexOf(e.currentTarget.id) == -1) {
            updateGraphs([...graphs, e.currentTarget.id])
        }

    }

    function showMore(e){

        let cat = e.currentTarget.id.split("_")[1]

        // Display more (up to 99)
        if(setIx[cat][0] == 0){
            setIx[cat][1](99)
            e.currentTarget.children[1].textContent = "- Hide"
        }
        // Display none
        else if (setIx[cat][0] == 99){
            setIx[cat][1](0)
            e.currentTarget.children[1].textContent = "+ Show"
        }

    }

    function showMoreStats(e) {
        let cat_id = e.currentTarget.id.split("_")[0]
        setShowMoreStats[cat_id][1](!setShowMoreStats[cat_id][0])
    }

    useEffect(() => {

        let url = new URL(window.location)
        let currentCountry = url.searchParams.get("q")

        if (!currentCountry) {
            currentCountry = "/world"
            url.searchParams.set("q", "world")
            window.history.pushState({}, "Map Search", url.pathname + url.search)
        }
        else { currentCountry = "/" + currentCountry }
        
        setMapTitle(countries_title[currentCountry])

        if (currentCountry != MDC.mapState.currentCountry) {
            console.log(currentCountry, MDC.mapState.currentCountry)
            console.log("Deleting Query Params... [NotebookCountry]")

            // Remove occ & loc queries from the URL
            url.searchParams.delete('loc')
            url.searchParams.delete('occ')
            sessionStorage.setItem('last_loc', '')
            sessionStorage.setItem('last_occ', '')
            window.history.pushState({}, "", url.pathname + url.search)

            MDC.mapDispatch({
                type: "UPDATE_COUNTRY",
                currentCountry: currentCountry,
                currentCountryTitle: countries_title[currentCountry],
                notebook_type_abbrev: "cou",
                mapType: "country"
            })
        }

    },[])

    return (

        <div id="notebook">

            { window.innerWidth > 768 ? 
                <>
                    <NotebookHeader onClick={function(){
                            setSearchOpen(!searchOpen)
                            setTimeout(function(){
                                document.getElementById('c_src').focus()
                            }, 300)
                        }}>

                        <h4 id={MDC.mapState.currentCountry} style={{margin:0}}>{mapTitle}</h4>
                        { searchOpen ? 
                            // These h3's are the same thing (double chevron svg), one is rotated when the search is open
                            <h4 style={
                                {
                                    margin:0, 
                                    transform:"rotate(-180deg)", 
                                    position:"relative", 
                                    bottom:"5px", 
                                    transition:"transform .6s ease"
                                }
                            }>
                                <svg fill="#333c" height="25" width="25" viewBox="0 0 24 24"><g><path d="M12 19.344l-8.72-8.72c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l9.25 9.25c.292.294.767.294 1.06 0l9.25-9.25c.146-.145.22-.337.22-.53s-.073-.383-.22-.53c-.293-.292-.768-.292-1.06 0L12 19.344z"></path><path d="M12 11.535l-8.72-8.72c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l9.25 9.25c.292.294.767.294 1.06 0l9.25-9.25c.146-.145.22-.337.22-.53s-.073-.383-.22-.53c-.293-.292-.768-.292-1.06 0L12 11.535z"></path></g></svg>
                            </h4>
                        :
                            <h4 style={
                                {
                                    margin:0, 
                                    transition:"transform .6s ease"
                                }
                            }>
                                <svg fill="#333c" height="25" width="25" viewBox="0 0 24 24"><g><path d="M12 19.344l-8.72-8.72c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l9.25 9.25c.292.294.767.294 1.06 0l9.25-9.25c.146-.145.22-.337.22-.53s-.073-.383-.22-.53c-.293-.292-.768-.292-1.06 0L12 19.344z"></path><path d="M12 11.535l-8.72-8.72c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l9.25 9.25c.292.294.767.294 1.06 0l9.25-9.25c.146-.145.22-.337.22-.53s-.073-.383-.22-.53c-.293-.292-.768-.292-1.06 0L12 11.535z"></path></g></svg>
                            </h4>
                        }

                    </NotebookHeader>

                    <SearchSelect 
                        data={Object.entries(countries)} 
                        searchOpen={searchOpen}
                        setSearchOpen={setSearchOpen}
                        selectCountry={selectCountry} 
                        setMapTitle={setMapTitle} 
                        dispatch={MDC.mapDispatch}>
                    </SearchSelect>
                    
                </>
            : 
                <>
                    <MobileSearchSelect 
                        data={Object.entries(countries)} 
                        searchOpen={searchOpen} 
                        selectCountry={selectCountry} 
                        setMapTitle={setMapTitle} 
                        dispatch={MDC.mapDispatch}>
                    </MobileSearchSelect>
                </>
            }
            {MDC.mapState.current_nation_stats ? 

                <>
                    <NotebookSection id="natl_category_1" category="1">
                        
                        <CategoryHeading onClick={showMore} id="cat_1" color="yellow">
                            <p>Population</p>
                            <p className="show-more">+ Show</p>
                        </CategoryHeading>

                        {MDC.mapState.current_nation_stats["cat_1"].map(function(item, i){

                            const [value, year] = mostRecentStat(item)

                            return c1_showLess  && i > 7 ? null
                            : (
                                <div key={item.code}>
                                    { year != null && value != null && graphs ? 
                                        <NotebookSegment 
                                            active={graphs.indexOf(item.code) != -1 ? true : false} id={item.code} 
                                            onClick={addToGraph} 
                                            role="data"  
                                            enum={i} 
                                            category="1" 
                                            className={String(i >= ix_count_1 ? " hide-me" : " segment-row")}
                                            style={{background: graphs.indexOf(item.code) != -1 ? colors[graphs.indexOf(item.code)] : i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >
                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">{

                                            isApercent(data_series_lookup_table[item.code]) ?
                                                String(Number(value).toLocaleString()) + "%"
                                            :
                                                String(Number(value).toLocaleString())

                                            }</NotebookParagraph>
                                            <NotebookParagraph style={{paddingRight: "15px"}} unit="year">({year})</NotebookParagraph>
                                        </NotebookSegment>                                            
                                    :
                                    <NotebookSegment 
                                    
                                    className={String(i >= ix_count_1 ? " hide-me" : " segment-row no-evt")}
                                    style={{background: i % 2 == 1 ? "#fff1" : "#0003"}}
                                >
                                    <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                    <NotebookParagraph unit="value">No Data</NotebookParagraph>

                                </NotebookSegment>  
                                }

                                
                                </div>

                            )
                        })}

                        <p id="c1_showMoreStats" className={setIx["1"][0] !== 0 ? 'mid-text ' : 'hide-me' } onClick={showMoreStats}>
                            {c1_showLess == 1 ?
                                <span>See More Population Statistics +</span>
                            :
                                <span>See Less Population Statistics -</span>
                            }
                        </p>

                    </NotebookSection>
                    <NotebookSection id="natl_category_2" category="2">

                        <CategoryHeading id="cat_2" onClick={showMore} color="green">
                            <p>Energy</p>
                            <p className="show-more">+ Show</p>
                        </CategoryHeading>


                        {MDC.mapState.current_nation_stats["cat_2"].map(function(item, i){

                            const [value, year] = mostRecentStat(item)

                            return c2_showLess  && i > 7 ? null
                            : (
                                <div key={item.code}>
                                    { year != null && value != null && graphs ? 
                                        <NotebookSegment 
                                            active={graphs.indexOf(item.code) != -1 ? true : false} 
                                            id={item.code} 
                                            onClick={addToGraph} 
                                            role="data"  
                                            enum={i} 
                                            category="2" 
                                            className={String(i >= ix_count_2 ? " hide-me" : " segment-row")}
                                            style={{background: graphs.indexOf(item.code) != -1 ? colors[graphs.indexOf(item.code)] : i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >
                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">{
                                           
                                           isApercent(data_series_lookup_table[item.code]) ?
                                               String(Number(value).toLocaleString()) + "%"
                                           :
                                               String(Number(value).toLocaleString())

                                           }</NotebookParagraph>
                                            <NotebookParagraph style={{paddingRight: "15px"}} unit="year">({year})</NotebookParagraph>
                                        </NotebookSegment>  
                                    :
                                        <NotebookSegment 
                                            
                                            className={String(i >= ix_count_2 ? " hide-me" : " segment-row no-evt")}
                                            style={{background: i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >
                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">No Data</NotebookParagraph>

                                        </NotebookSegment>  
                                }
                                
                                </div>
                            )
                        })}

                        <p id="c2_showMoreStats" className={setIx["2"][0] !== 0 ? 'mid-text ' : 'hide-me' } onClick={showMoreStats}>
                            {c2_showLess == 1 ?
                                <span>See More Energy Statistics +</span>
                            :
                                <span>See Less Energy Statistics -</span>
                            }
                        </p>

                    </NotebookSection>

                    <NotebookSection id="natl_category_3" category="3">
                    
                        <CategoryHeading id="cat_3" onClick={showMore} color="orange">
                            <p>Education</p>
                            <p className="show-more">+ Show</p>
                        </CategoryHeading>


                        {MDC.mapState.current_nation_stats["cat_3"].map(function(item, i){

                            const [value, year] = mostRecentStat(item)

                            return c3_showLess  && i > 7 ? null
                            : (
                                <div key={item.code}>
                                    { year != null && value != null && graphs ? 
                                        <NotebookSegment 
                                            active={graphs.indexOf(item.code) != -1 ? true : false} 
                                            id={item.code} 
                                            onClick={addToGraph} 
                                            role="data"  
                                            enum={i} 
                                            category="3" 
                                            className={String(i >= ix_count_3 ? " hide-me" : " segment-row")}
                                            style={{background: graphs.indexOf(item.code) != -1 ? colors[graphs.indexOf(item.code)] : i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >
                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">{
                                           
                                           isApercent(data_series_lookup_table[item.code]) ?
                                               String(Number(value).toLocaleString()) + "%"
                                           :
                                           data_series_lookup_table[item.code].indexOf("ratio") != -1 ?
                                               String(Number(value).toLocaleString()) + ":1"
                                            :
                                                String(Number(value).toLocaleString())


                                           }</NotebookParagraph>
                                            <NotebookParagraph style={{paddingRight: "15px"}} unit="year">({year})</NotebookParagraph>
                                        </NotebookSegment>    
                                    :
                                        <NotebookSegment 
                                            
                                            className={String(i >= ix_count_3 ? " hide-me" : " segment-row no-evt")}
                                            style={{background: i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >
                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">No Data</NotebookParagraph>

                                        </NotebookSegment>  
                                }
                                
                                </div>

                            )

                        })}

                        <p id="c3_showMoreStats" className={setIx["3"][0] !== 0 ? 'mid-text ' : 'hide-me' } onClick={showMoreStats}>
                            {c3_showLess == 1 ?
                                <span>See More Education Statistics+</span>
                            :
                                <span>See Less Education Statistics -</span>
                            }
                        </p>

                    </NotebookSection>

                    <NotebookSection id="natl_category_5" category="5">
                        
                        <CategoryHeading id="cat_5" onClick={showMore} color="purple">
                            <p>Economics</p>
                            <p className="show-more">+ Show</p>
                        </CategoryHeading>

                        {MDC.mapState.current_nation_stats["cat_5"].map(function(item, i){

                            const [value, year] = mostRecentStat(item)

                            return c5_showLess  && i > 7 ? null
                            : (
                                <div key={item.code}>
                                    { year != null && value != null && graphs ? 
                                        <NotebookSegment 
                                            active={graphs.indexOf(item.code) != -1 ? true : false} 
                                            id={item.code} 
                                            onClick={addToGraph} 
                                            role="data"  
                                            enum={i} 
                                            category="5" 
                                            className={String(i >= ix_count_5 ? " hide-me" : " segment-row")}
                                            style={{background: graphs.indexOf(item.code) != -1 ? colors[graphs.indexOf(item.code)] : i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >
                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">{
                                           
                                           isApercent(data_series_lookup_table[item.code]) ?
                                               String(Number(value).toLocaleString()) + "%"
                                           :
                                               String(Number(value).toLocaleString())

                                           }</NotebookParagraph>
                                            <NotebookParagraph style={{paddingRight: "15px"}} unit="year">({year})</NotebookParagraph>
                                        </NotebookSegment>    
                                    :
                                        <NotebookSegment 
                                            
                                            className={String(i >= ix_count_5 ? " hide-me" : " segment-row no-evt")}
                                            style={{background: i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >
                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">No Data</NotebookParagraph>

                                        </NotebookSegment>  
                                }
                                
                                </div>
                            )
                        })}

                        <p id="c5_showMoreStats" className={setIx["5"][0] !== 0 ? 'mid-text ' : 'hide-me' } onClick={showMoreStats}>
                            {c5_showLess == 1 ?
                                <span>See More Economic Statistics+</span>
                            :
                                <span>See Less Economic Statistics-</span>
                            }
                        </p>

                    </NotebookSection>

                    <NotebookSection id="natl_category_6" category="6">

                        <CategoryHeading id="cat_6" onClick={showMore} color="white">
                            <p>Tech</p>
                            <p className="show-more">+ Show</p>
                        </CategoryHeading>


                        {MDC.mapState.current_nation_stats["cat_6"].map(function(item, i){

                            const [value, year] = mostRecentStat(item)

                            return c6_showLess  && i > 7 ? null
                            : (
                                <div key={item.code}>
                                    { year != null && value != null && graphs ? 
                                        <NotebookSegment 
                                            active={graphs.indexOf(item.code) != -1 ? true : false} 
                                            id={item.code} 
                                            onClick={addToGraph} 
                                            role="data"  
                                            enum={i} 
                                            category="6" 
                                            className={String(i >= ix_count_6 ? " hide-me" : " segment-row")}
                                            style={{background: graphs.indexOf(item.code) != -1 ? colors[graphs.indexOf(item.code)] : i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >
                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">{
                                           
                                           isApercent(data_series_lookup_table[item.code]) ?
                                               String(Number(value).toLocaleString()) + "%"
                                           :
                                               String(Number(value).toLocaleString())

                                           }</NotebookParagraph>
                                            <NotebookParagraph style={{paddingRight: "15px"}} unit="year">({year})</NotebookParagraph>
                                        </NotebookSegment>                                           
                                    :
                                        <NotebookSegment 
                                            
                                            className={String(i >= ix_count_6 ? " hide-me" : " segment-row no-evt")}
                                            style={{background: i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >
                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">No Data</NotebookParagraph>

                                        </NotebookSegment>  
                                }
                                
                                </div>
                            )
                        })}

                        <p id="c6_showMoreStats" className={setIx["6"][0] !== 0 ? 'mid-text ' : 'hide-me' } onClick={showMoreStats}>
                            {c6_showLess == 1 ?
                                <span></span>
                            :
                                <span></span>
                            }
                        </p>

                    </NotebookSection>

                    <NotebookSection id="natl_category_7" category="7">

                        <CategoryHeading id="cat_7" onClick={showMore} color="pink">
                            <p>Commerce and Trade</p>
                            <p className="show-more">+ Show</p>
                        </CategoryHeading>


                        {MDC.mapState.current_nation_stats["cat_7"].map(function(item, i){

                            const [value, year] = mostRecentStat(item)

                            return c7_showLess  && i > 7 ? null
                            : (
                                <div key={item.code}>
                                    { year != null && value != null && graphs ? 
                                        <NotebookSegment 
                                            active={graphs.indexOf(item.code) != -1 ? true : false} 
                                            id={item.code} 
                                            onClick={addToGraph} 
                                            role="data"  
                                            enum={i} 
                                            category="7" 
                                            className={String(i >= ix_count_7 ? " hide-me" : " segment-row")}
                                            style={{background: graphs.indexOf(item.code) != -1 ? colors[graphs.indexOf(item.code)] : i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >
                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">{
                                        
                                                isApercent(data_series_lookup_table[item.code]) ?
                                                    String(Number(value).toLocaleString()) + "%"
                                                :
                                                    String(Number(value).toLocaleString())

                                            }
                                            </NotebookParagraph>
                                            <NotebookParagraph style={{paddingRight: "15px"}} unit="year">({year})</NotebookParagraph>
                                        </NotebookSegment>                                           
                                    :

                                        <NotebookSegment 
                                            
                                            className={String(i >= ix_count_7 ? " hide-me" : " segment-row no-evt")}
                                            style={{background: i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >
                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">No Data</NotebookParagraph>

                                        </NotebookSegment>  
                                
                                    }
                                
                                </div>

                            )

                        })}

                    <p id="c7_showMoreStats" className={setIx["7"][0] !== 0 ? 'mid-text ' : 'hide-me' } onClick={showMoreStats}>
                            {c7_showLess == 1 ?
                                <span>See More Commerce Statistics+</span>
                            :
                                <span>See Less Commerce Statistics -</span>
                            }
                        </p>

                    </NotebookSection>

                    <NotebookSection id="natl_category_4" category="4">

                        <CategoryHeading id="cat_4" onClick={showMore} color="blue">
                            <p>Miscellaneous</p>
                            <p className="show-more">+ Show</p>
                        </CategoryHeading>


                        {MDC.mapState.current_nation_stats["cat_4"].map(function(item, i) {

                            const [value, year] = mostRecentStat(item)

                            return c4_showLess  && i > 7 ? null
                            :  (

                                <div key={item.code}>

                                    { year != null && value != null && graphs ? 
                                        <NotebookSegment 
                                            active={graphs.indexOf(item.code) != -1 ? true : false} 
                                            id={item.code} 
                                            onClick={addToGraph} 
                                            role="data"  
                                            enum={i} 
                                            category="4" 
                                            className={String(i >= ix_count_4 ? " hide-me" : " segment-row")}
                                            style={{background: graphs.indexOf(item.code) != -1 ? colors[graphs.indexOf(item.code)] : i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >


                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">{
                                           
                                           isApercent(data_series_lookup_table[item.code]) ?
                                               String(Number(value).toLocaleString()) + "%"
                                           :
                                               String(Number(value).toLocaleString())

                                           }</NotebookParagraph>
                                            <NotebookParagraph style={{paddingRight: "15px"}} unit="year">({year})</NotebookParagraph>
                                        </NotebookSegment> 
                                    :
                                        <NotebookSegment 
                                            
                                            className={String(i >= ix_count_4 ? " hide-me" : " segment-row no-evt")}
                                            style={{background: i % 2 == 1 ? "#fff1" : "#0003"}}
                                        >
                                            <NotebookParagraph style={{paddingLeft: "15px"}} unit="title">{data_series_lookup_table[item.code]}</NotebookParagraph>
                                            <NotebookParagraph unit="value">No Data</NotebookParagraph>

                                        </NotebookSegment>  
                                }

                                </div>
                            )

                        })}
                        <p id="c4_showMoreStats" className={setIx["4"][0] !== 0 ? 'mid-text ' : 'hide-me' } onClick={showMoreStats}>
                            {c4_showLess == 1 ?
                                <span></span>
                            :
                                <span></span>
                            }
                        </p>
                    </NotebookSection>

                </>

            : null }

        </div>

    )

}

// Search module in the /country select menu
export function SearchSelect(props) {

    // Remove non-matches as the user types
    function findMatches(e) {

        let val = e.currentTarget.value.toLowerCase()
        let items = document.getElementsByClassName('sc-i')

        Array.from(items).forEach( el => {

            if (el.textContent.toLowerCase().indexOf(val) == -1) {
                el.classList.add("hide-me")

            } else
                el.classList.remove("hide-me")

        })

    }

    /**
     * Tell the parent which value was selected
     * @param {event} e 
     */
    function updateValue(e) {
        props.setSearchOpen(!props.searchOpen)
        props.selectCountry([e.currentTarget.textContent, countries[e.currentTarget.textContent]], props.dispatch)
        props.setMapTitle(e.currentTarget.textContent)

    }

    return (

        <>
            {/* Says Styled Select but it's a div :D */}
            <StyledSearchSelect id="autoSearch" className={props.searchOpen ? "hi" : "lo"}>
                <div style={{display:"flex", justifyContent: "left", alignItems:"center", background:"white", borderBottom:"1px solid #333", paddingLeft: "10px"}}>
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18"><path fill="#ccc" d="M18 16.5l-5.14-5.18h-.35a7 7 0 10-1.19 1.18v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z"></path></svg>
                    <input id="c_src" style={{float:"right", zIndex:'100', width:"38vw", height:"35px", border:"none", outline:"none"}} autoComplete="off" type="text" onChange={findMatches} placeholder="Country Name" />
                </div>
                <ul className="auto-ul" style={{paddingTop:"20px", background:"white", margin:"0", borderBottom: "2px solid #333"}}>
                    {props.data.map(function(item, i){
                        return (
                            <li onClick={updateValue} className="sc-i" key={item[1]} id={item[1]}>{item[0]}</li>
                        )
                    })}
                </ul>
            </StyledSearchSelect>

        </>

    )
}

function MobileSearchSelect(props) {

    /**
     * Tell the parent which value was selected
     * @param {event} e 
     */
    function updateValue(e) {

        let c_selection = e.currentTarget.options[e.currentTarget.selectedIndex].text

        console.log(e.currentTarget.selectedIndex)

        props.selectCountry([c_selection, countries[c_selection]], props.dispatch)
        props.setMapTitle(c_selection)

    }

    return (
      <>
          <select id="c-sel-mobile" onChange={updateValue}>
              {props.data.map( (item, i) => {
                  return (
                      <option id={item[1]} key={"c-" + String(i)} value={item[1]}>{item[0]}</option>
                  )
              })}
          </select>
      </>
    )
  }

export default NotebookCountry

// <!-- Down Chevron -->
// <svg viewBox="0 0 24 24"><g><path d="M12 19.344l-8.72-8.72c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l9.25 9.25c.292.294.767.294 1.06 0l9.25-9.25c.146-.145.22-.337.22-.53s-.073-.383-.22-.53c-.293-.292-.768-.292-1.06 0L12 19.344z"></path><path d="M12 11.535l-8.72-8.72c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l9.25 9.25c.292.294.767.294 1.06 0l9.25-9.25c.146-.145.22-.337.22-.53s-.073-.383-.22-.53c-.293-.292-.768-.292-1.06 0L12 11.535z"></path></g></svg>

// <!-- Up Chevron -->
// <svg viewBox="0 0 24 24"><g><path d="M12 4.656l8.72 8.72c.293.293.768.293 1.06 0s.294-.768 0-1.06l-9.25-9.25c-.292-.294-.767-.294-1.06 0l-9.25 9.25c-.146.145-.22.337-.22.53s.073.383.22.53c.293.292.768.292 1.06 0L12 4.656z"></path><path d="M12 12.465l8.72 8.72c.293.293.768.293 1.06 0s.294-.768 0-1.06l-9.25-9.25c-.292-.294-.767-.294-1.06 0l-9.25 9.25c-.146.145-.22.337-.22.53s.073.383.22.53c.293.292.768.292 1.06 0l8.72-8.72z"></path></g></svg>