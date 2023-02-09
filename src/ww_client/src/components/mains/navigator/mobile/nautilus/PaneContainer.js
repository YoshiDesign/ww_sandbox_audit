import React, { useContext, useEffect, useState } from 'react'
import LeftPane from './panes/LeftPane'
import InfoPane from './panes/InfoPane'
import RightPane from './panes/RightPane'
import NoInfo from '../../../tools/NoInfo'
import {useWindowSize} from '../../../../../helpers/functional/windowHook'

/**
 * THIS COMPONENT ONLY APPEARS ON MOBILE
 */
export default React.memo(function PaneContainer ({
    setNewOptions, 
    nautilusState
}) {

    const size = useWindowSize();
    /**
     * @function setNewOptions - (natuilus.setState()) Update the Nautilus's state with the selected option's abbrev.
     * @prop optionDisplay - Determine which option's window is available. Changes descriptions in Right Pane
     * @prop ustate - Lets us know which Pane is currently visible. Used to transition SVGs and Pane opacity
     */
    return (

        <>

            {window.innerWidth <= 768 ? 
            <>
                {/* <Log name="Pane Container" /> */}
                {/* TODO - Figure out if these Components need an id prop */}
                {/* <Log name="PaneContainer" /> */}
                <LeftPane left id="leftPane" />
                <NoInfo type="mobile_or_whatever" />
                <InfoPane id="infoPane" windowSize={size}>
                </InfoPane>
                <RightPane right id="rightPane" />
            </>

            : null }

        </>

    )

})