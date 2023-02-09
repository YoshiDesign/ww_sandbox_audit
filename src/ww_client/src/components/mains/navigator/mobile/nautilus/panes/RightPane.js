import React, {useEffect, useContext, useState} from 'react'
import { MapDataContext } from '../../../../../../context/MapDataContext'
import { NautilusContext } from '../../Nautilus'

import { 
    StyledPane,
 } from '../../../../../style/styled'

const RightPane = React.memo( (props) => {

    const MDC = useContext(MapDataContext)

    const options = {
        color_swatch: 1,
        type: "COLOR"
    }

    return (
        <>

            {/* <Log name="Right-Pane" /> */}
            <StyledPane className={MDC.nautState.right_pane === true ? " " : "no-fill"} id="right-pane" rightPane >

                {/* Color function code is duplicated in CoL options */} 
                <div className="fl-row">
                    <div className="bg">
                        <div className="title-contents">
                            <h3 className="bg-title">Other Options</h3>
                        </div>
                        <select onChange={e => 
                            MDC.mapDispatch({ ...options,
                                color_swatch: e.target.value,
                                refetch: 0,
                                type: "COLOR"
                            })
                        }>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                </div>

            </StyledPane>

        </>
    )
})


export default RightPane