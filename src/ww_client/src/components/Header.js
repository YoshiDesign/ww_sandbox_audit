import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SearchBar from './mains/navigator/SearchBar'
import UserPane from './mains/navigator/UserPane'
import {
    StyledNavbar
} from './style/styled'
import logo from '../assets/images/logolol.png'

import {
    Link
} from 'react-router-dom'

export default function Header () {


    // const {user} = useAuthState()
    return (
        <>
        {/* <Log name="Header" /> */}
            <StyledNavbar id="navigator" className="navi stop-w">
                <div role="menubar" className="auto-mg h100 grid mx-wd">

                    <div className="primary">
                        
                        <Link className="logo" to="/">
                            <img height="40" width="100" src={logo} />
                        </Link>
                        <SearchBar _id="main_src" styled="DEFAULT" classes=""/>

                        <ol role="presentation" className="usr-head ctr-items xmar-xpad flow-auto ml-auto h100 grid list-norm">
                            <UserPane />
                        </ol>

                    </div>

                </div>
            </StyledNavbar>
        </>
    );
}