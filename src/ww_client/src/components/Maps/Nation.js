import React, { useContext} from 'react'
import { MapDataContext } from '../../context/MapDataContext'
import {StyledCartographerWrapper} from '../style/styled'
import LoadingComponent from '../LoadingComponent'

function Nation() {

    const MDC = useContext(MapDataContext)

    return (

        <>

            {MDC.mapState.loading == true ? 
                <LoadingComponent> 
                    Loading
                </LoadingComponent> 
            : null }

            <StyledCartographerWrapper id="nation-wrapper">

            </StyledCartographerWrapper>
        </>

    )
}

export default Nation
