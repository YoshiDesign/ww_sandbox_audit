import React, {useContext, useEffect, useState} from 'react'
import {activateButtons} from '../../../helpers/utils'
import logo_proj_mobile from '../../../assets/images/map-tp.png'
import logo_proj from '../../../assets/images/logo_proj.png'
import {MapDataContext} from '../../../context/MapDataContext'
import {
    StyledInputGroup,
    StyledTextarea,
    StyledInput,
    StyledSelect
} from '../../style/styled'

const categories = ["Choose a Category",
    "Visual Arts", "Music", "Media Production", "Handmade Crafts", "Software", "Games", "Streaming", "Entertainer",
    "Comedy", "Maker", "Tinkerer", "Creative Writer", "Digital Arts", "Mixed Media Art", "Martial Arts", "Web Development",
    "Fitness", "Wellness", "Mindfulness", "Traveler", "Designer", "Photographer", "Videographer", "Yoga", "Therapy", "Dance",
    "Live Performance", "Automation", "Science", "Engineering"
]

function NotebookCreators(props) {
    const MDC = useContext(MapDataContext)
    const [countries, setCountries] = useState({})

    function updateCategories() {

    }

    /**
     * Fetch from local storage until the list of countries is available
     */
    function getCountries(){
        let c =  JSON.parse(sessionStorage.getItem('countries'))
        if (!c) {
            setTimeout(() => {
                getCountries()
            }, 500);
        } else {
            setCountries(c)
        }
    }

    useEffect( ()=> {

        let map_wrapper = document.getElementById('main-content-wrapper')
        map_wrapper.style.overflowX = "hidden"
        map_wrapper.style.overflowY = "auto"

        document.getElementById("notebook").style.overflowY = "hidden"

        // Optimize this please
        let url = new URL(window.location)
        let path = url.pathname.replace(/\/+$/, "").split("/")
 
        getCountries()
  
        if ( MDC.mapState.notebook == null && MDC.mapState.notebook_type_abbrev == "cre" ||
         (path[path.length - 1] == "creators" && url.search === "")
        ) {
            document.getElementById("notebook").classList.add('n-src')
        } 
        else {
            document.getElementById("notebook").classList.remove('n-src')
        }

        return function(){
            document.getElementById("notebook").style.overflowY = "auto"
            let map_wrapper = document.getElementById('main-content-wrapper')
            map_wrapper.style.overflowX = "unset"
            map_wrapper.style.overflowY = "unset"
        }

    }, [])

    return (
        <div id="notebook" className={String(MDC.mapState.notebooks.cre_notebook == null ? "": "dt-pad " ) + "n-src"}>
            {/* <button onClick={manualOverride}></button> */}
            {!MDC.mapState.notebooks.cre_notebook ? // Default
                <>
                    <h3>Content Creators, get on the map!</h3>
                    <ul>
                        <li>Coming Soon... But you can setup your profile now!<br /><br /><strong>A profile will be auto-generated</strong> based on the information you provide below. Once this feature is available your profile will be visible from your region. You may also choose to remain anonymous.</li>
                    </ul>
                    <form method="POST" action="/users/signup">
                        <StyledInputGroup>
                            <StyledInput placeholder="First Name" name="firstname" type="text" />
                            <StyledInput placeholder="Last Name" name="lastname"  type="text" />
                        </StyledInputGroup>
                        <StyledInputGroup>
                            <StyledTextarea placeholder="Topics..." name="categories" id="category">
                            </StyledTextarea>
                        </StyledInputGroup>
                        <StyledInputGroup>
                            <StyledSelect name="country" id="countries">
                                {Object.keys(countries).map(function(k, i) {
                                    return (<option key={i} value={k}>{countries[k]}</option>)
                                })}
                            </StyledSelect>
                        </StyledInputGroup>
                        <StyledInputGroup>
                            <input type="submit" />
                        </StyledInputGroup>
                    </form>
                    
                    {window.innerWidth > 768 ? 
                    
                    <img className="proj-logo" width="360" src={logo_proj} />
                    : 
                    <img className="proj-logo-mobile" width="360" src={logo_proj_mobile} />
                     }

                </>
            :
                <>
                    <p>No Data</p>
                    {/* {props.children} */}
                </>
            }
        </div>
    )
}

export default React.memo(NotebookCreators)
