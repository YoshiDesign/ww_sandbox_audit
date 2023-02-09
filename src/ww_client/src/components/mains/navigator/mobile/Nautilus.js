import React, { useEffect, useReducer, useContext } from 'react'
import {nautilusReducer} from '../../../../context/reducers/nautilusReducer' 
import {useWindowSize} from '../../../../helpers/functional/windowHook'
import { MapDataContext } from '../../../../context/MapDataContext'

//        .==.        .==.  //\\       //\\        
//       //`^\\      //^`\\/`^\\      //^`\\         
//      // ^ ^\(\__/)/^ ^^\\^ ^\(\__/)/^ ^^\\        
//     //^ ^^ ^/ç  ç\ ^^ ^ \\^ ^/∆  ∆\ ^^ ^ \\       
//    //^ ^^ ^/( .. )\^ ^ ^ \\^/( .. )\^ ^ ^ \\      
//   // ^^ ^/\| v""v |/\^ ^ ^\\  v""v |/\^ ^ ^\\     
//  // ^^/\/ /  `~~`  \ \/\^ ^\\ `~~`  \ \/\^ ^\\    
//  ----------------------------------------------
///       HERE BE MORE DRAGONS

export const NautilusContext = React.createContext()

const initState = {
    ip: false,
    rp: false,
    lp: false,
    left_spin: false,
    right_spin: false,
    naut_open: false
}

export function NautilusProvider (props) {

    const [nautState, nautDispatch] = useReducer(nautilusReducer, initState)
    const windowSize = useWindowSize()
    const MDC = useContext(MapDataContext)

    useEffect(()=>{
        /**
         * Catch the window width so the Nautilus rendereth
         */
    }, [windowSize.width])

    useEffect(() => {
        setTimeout(function(){
            console.log("Detected Change in MDC HomeButton...\nLP:", nautState.lp, "\n?", window.location.pathname)
            if (nautState.lp == false && window.location.pathname == "/map/home") {
                document.getElementById('home').classList.remove('wl-active')
                // MDC.mapDispatch({
                //     type: "MOBILE_HOME",
                //     nbta: false
                // })
            }
    
            else if (nautState.lp == true && window.location.pathname == "/map/home") {
                document.getElementById('home').classList.add('wl-active')
            }
        },3000)
        
    }, [MDC.mapState.open_home_from_mdc])

    return (

        <>

            <NautilusContext.Provider value={{nautState: nautState, nautDispatch: nautDispatch}} >

                { window.innerWidth > 768 ? 

                    <>

                        {/* DESKTOP - Nautilus is only for mobile */}

                    </>

                :

                    <>

                        {/* MOBILE */}
                        {props.children}
                        
                    </>
                } 

            </NautilusContext.Provider >

        </>

    )
}
