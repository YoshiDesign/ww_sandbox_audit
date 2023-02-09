import React, {useEffect, useContext} from 'react'
import axios from 'axios'
import { MapDataContext } from '../../context/MapDataContext'
import {StyledCartographerWrapper} from '../style/styled'
import {initializeGlobeMap} from './utils/utils'
import LoadingComponent from '../LoadingComponent'

function Globe() {

    const MDC = useContext(MapDataContext)

    useEffect(()=>{

        let map = sessionStorage.getItem("map_" + MDC.mapState.mapType)

        console.log("MAP", JSON.parse(map))

        if (map) {  // No need to fetch from the server
            console.log("{{{Render Globe From Session}}}")
            // Timeout is necessary bc session storage fetch happens before the page is fully rendered... sometimes
            setTimeout(function() {

                let check = document.getElementById('globe-canvas')
                if (check) return

                // Actually construct the map and tear down the loading animation
                initializeGlobeMap(JSON.parse(map)).then(()=>{
                    MDC.mapDispatch({
                        type:"END_LOADING"
                    })
                })

            },1800)

        }
        else {

            axios.get('/api/datas/mapData?map_key=map_' + MDC.mapState.mapType.toLowerCase(), {}, {
                proxy: {
                    host: 'localhost',
                    port: 4000
                }
            }).then( async (res) => {

                initializeGlobeMap(res.data).then(()=>{
                    MDC.mapDispatch({
                        type:"END_LOADING"
                    })
                })
                // Really store the map in session storage
                sessionStorage.setItem('map_' + MDC.mapState.mapType, JSON.stringify(res.data))
                //sessionStorage.setItem('countries', JSON.stringify(JSON.parse(res.data.countries)))

            }).catch( err => {
                // Seriously grab a mango white claw
                console.error("Error from Server: ", err);
            })

        }

        // TODO - Probably use this at some point. Audit any GC that needs to happen maybe
        return function() {
            MDC.mapDispatch({
                ...MDC.mapState, type:"CLEAN"
            })
        }

    }, [])

    return (

        <>

            {MDC.mapState.loading == true ? 
                <LoadingComponent> 
                    Loading
                </LoadingComponent> 
            : null }

            <StyledCartographerWrapper id="globe-wrapper">
                

            </StyledCartographerWrapper>

        </>
    )
}

export default Globe
