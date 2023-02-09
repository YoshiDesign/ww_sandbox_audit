import React, {useEffect, useState, useContext} from 'react'
import { countries } from '../../../../../Maps/utils/utils'
import { MapDataContext } from '../../../../../../context/MapDataContext'
import { Link } from 'react-router-dom'
import { 
    StyledSearchSelect, 
    NotebookHeader 
} from '../../../../../style/styled'

function HomePane() {

    const MDC = useContext(MapDataContext)
    const [searchOpen, setSearchOpen] = useState(false)

    return (
        <div className="">
            { window.innerWidth > 768 ? 
                <>
                    <p className="in-text">
                        Choose a country to inspect its major economic statistics. If we have adequate occupational or cost of living data for your country then you will 
                        be able to interact with its map in much greater detail.
                    </p>
                    {/* <h3>Select a country to get started</h3> */}
                    {/* <NotebookHeader onClick={
                        function(){
                            setSearchOpen(!searchOpen)
                            setTimeout(function(){
                                document.getElementById('c_src').focus()
                            }, 300)
                        }}>

                        <h3 id={MDC.mapState.currentCountry} style={{margin:0}}>Select a country</h3>
                        { searchOpen ? 
                            // These h3's are the same thing (double chevron svg), one is rotated when the search is open
                            <h3 style={
                                {
                                    margin:0, 
                                    transform:"rotate(-180deg)", 
                                    position:"relative", 
                                    bottom:"5px", 
                                    transition:"transform .6s ease"
                                }
                            }>
                                <svg fill="#333c" height="25" width="25" viewBox="0 0 24 24"><g><path d="M12 19.344l-8.72-8.72c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l9.25 9.25c.292.294.767.294 1.06 0l9.25-9.25c.146-.145.22-.337.22-.53s-.073-.383-.22-.53c-.293-.292-.768-.292-1.06 0L12 19.344z"></path><path d="M12 11.535l-8.72-8.72c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l9.25 9.25c.292.294.767.294 1.06 0l9.25-9.25c.146-.145.22-.337.22-.53s-.073-.383-.22-.53c-.293-.292-.768-.292-1.06 0L12 11.535z"></path></g></svg>
                            </h3>
                        :
                            <h3 style={
                                {
                                    margin:0, 
                                    transition:"transform .6s ease"
                                }
                            }>
                                <svg fill="#333c" height="25" width="25" viewBox="0 0 24 24"><g><path d="M12 19.344l-8.72-8.72c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l9.25 9.25c.292.294.767.294 1.06 0l9.25-9.25c.146-.145.22-.337.22-.53s-.073-.383-.22-.53c-.293-.292-.768-.292-1.06 0L12 19.344z"></path><path d="M12 11.535l-8.72-8.72c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l9.25 9.25c.292.294.767.294 1.06 0l9.25-9.25c.146-.145.22-.337.22-.53s-.073-.383-.22-.53c-.293-.292-.768-.292-1.06 0L12 11.535z"></path></g></svg>
                            </h3>
                        }

                    </NotebookHeader> */}
                    <HomeSearchSelect searchOpen={searchOpen} data={Object.entries(countries)}>

                    </HomeSearchSelect>
                </>
            : null}

            {/* <p>
                <strong>Help</strong> us fill in the map by <a href="#">submitting a data entry</a>. Each
                entry will be hand picked and verified to the best of our team's ability.
            </p> */}
            {/* <p><strong>Select one of our four categories to get started</strong> or click on any county in the USA if you know where you're going!</p> */}

            <h3 className="in-head">Employers, post a job</h3>
            <p className="in-text">
                Skip the recruiters and make a visible impact in your community by <a href="#">posting a job listing.</a> You'll appear on the map for everyone to see. 
                You'll get all of your applications emailed directly to your registered email address. If you can hire remote employees, here is the place to do it!
            </p>
{/* 
            <p>
                The World Works was designed and developed in the USA using fast and robust technologies to bring you a super high throughput map while optimizing for speed and ease of use. <a href="#">Follow our Twitter bot</a> for daily retweets about local affairs from all across the world!
            </p> */}
        </div>
    )
}

function HomeSearchSelect(props) {

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

    return (

        <>
            <div style={{display:"flex", justifyContent: "left", alignItems:"center", background:"white", borderBottom:"1px solid #333", paddingLeft: "10px"}}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18"><path fill="#ccc" d="M18 16.5l-5.14-5.18h-.35a7 7 0 10-1.19 1.18v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z"></path></svg>
                <input id="c_src" style={{float:"right", zIndex:'100', width:"38vw", height:"35px", border:"none", outline:"none"}} autoComplete="off" type="text" onChange={findMatches} placeholder="Search" />
            </div>


            <ul className="auto-ul" style={{paddingTop:"20px", listStyle:"none", background:"white", margin:"0", borderBottom: "2px solid #333"}}>
                {props.data.map(function(item, i){
                    return (
                        <Link style={{textDecoration:"none", fontSize:"16px"}} to={"/map/country?q=" + item[1].split("/")[1]} key={item[1]}>
                            <li style={{padding:"10px 0 10px 5px"}}key={"sc-" + item[1]} className="sc-i">
                                {item[0]}
                            </li>
                        </Link>
                    )
                })}
            </ul>

        </>

    )
}

export default HomePane
