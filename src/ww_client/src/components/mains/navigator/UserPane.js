import React from 'react'
// import axios from 'axios'
// import styled from 'styled-components';
// import {AuthContext} from '../../../App'
// import {getCookie, c_names} from '../../../helpers/Cookie'
// import {
//     Link
// } from 'react-router-dom'

// import gravatar from '../../../assets/images/grav-ph.png'

// const SESSION_COOKIE=c_names.SESSION_COOKIE
// const AUTH_COOKIE=c_names.AUTH_COOKIE

// const UserImage = styled.img`

//     &:hover {
//         box-shadow:0 2px 12px #a5d0ff, 0 0px 0px #a5d0ff, 0 0px 3px #a5d0ff;
//         cursor:pointer;
//     }

// `

function UserPane(props) {
    
    // const authContext = useContext(AuthContext)
    // const user = props.user

    // const logout = (e) => {
    //     e.preventDefault();
    //     console.log("Logging out")
    //     var cookie;
    //     if (cookie = getCookie(SESSION_COOKIE)) {

    //         axios.
    //         post('/accounts/logout', {
    //                 token:cookie,
    //                 username: authContext.user.email
    //             },{
    //                 proxy: {
    //                     host: 'localhost',
    //                     port: 4000
    //                 }
    //             })
    //             .then( res => {
    //                 if (res.data.success == false)
    //                     console.log("An error occurred while logging out");
    //                 console.log("Success logout")
    //             }).catch( err => {
    //                 console.log("Failed to log out from front end [102]")
    //             })

    //         console.log("clear history")
    //         // Clear the auth context's user and destroy the cookie
    //         authContext.user = null
    //         // setCookie(SESSION_COOKIE, null, -1)
    //         // setCookie(AUTH_COOKIE, null, -1)
    //         window.location = "/"
    //     }
    // }

    return (
        <>

        {/* { user ?  */}
            <>
                {/* <li className="listed">
                    <Link to="/dashboard" className="profile-pn">
                        <UserImage src={gravatar} className="bor-sm avatar" height="24" width="24"/> 
                    </Link>
                </li> */}
                <ul>
                    <li className="listed">
                        <a className="profile-pn ">
                        <svg 
                            height="26"
                            fill="white"
                            stroke="grey"
                            viewBox="0 -1 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.03093403,10 C7.03093403,8.36301971 8.36301971,7.03093403 10,7.03093403 C11.6369803,7.03093403 12.9679409,8.36301971 12.9679409,10 C12.9679409,11.6369803 11.6369803,12.969066 10,12.969066 C8.36301971,12.969066 7.03093403,11.6369803 7.03093403,10 M16.4016617,8.49127796 C16.2362761,7.79148295 15.9606334,7.13669084 15.5916096,6.5437777 L16.5231696,5.06768276 C16.7526843,4.70315931 16.7684353,4.22387849 16.5231696,3.83572852 C16.1833977,3.29794393 15.4712269,3.13593351 14.9323172,3.47683044 L13.4562223,4.40839036 C12.8633092,4.03936662 12.208517,3.76259882 11.508722,3.59833825 L11.1250724,1.89947899 C11.0294412,1.47982699 10.7020452,1.12992949 10.2542664,1.02867298 C9.63322641,0.888038932 9.01556168,1.27843904 8.87492764,1.89947899 L8.49127796,3.59833825 C7.79148295,3.76259882 7.13669084,4.03936662 6.54265263,4.40726528 L5.06768276,3.47683044 C4.70315931,3.24731568 4.22387849,3.23156466 3.83572852,3.47683044 C3.29794393,3.81660229 3.13593351,4.5287731 3.47683044,5.06768276 L4.40726528,6.54265263 C4.03936662,7.13669084 3.76259882,7.79148295 3.59721318,8.49127796 L1.89947899,8.87492764 C1.47982699,8.97055879 1.12992949,9.29795485 1.02867298,9.74573365 C0.888038932,10.3667736 1.27843904,10.9844383 1.89947899,11.1250724 L3.59721318,11.508722 C3.76259882,12.208517 4.03936662,12.8633092 4.40726528,13.4573474 L3.47683044,14.9323172 C3.24731568,15.2968407 3.23156466,15.7761215 3.47683044,16.1642715 C3.81660229,16.7020561 4.5287731,16.8640665 5.06768276,16.5231696 L6.54265263,15.5927347 C7.13669084,15.9606334 7.79148295,16.2374012 8.49127796,16.4016617 L8.87492764,18.100521 C8.97055879,18.520173 9.29795485,18.8700705 9.74573365,18.971327 C10.3667736,19.1119611 10.9844383,18.721561 11.1250724,18.100521 L11.508722,16.4016617 C12.208517,16.2374012 12.8633092,15.9606334 13.4562223,15.5916096 L14.9323172,16.5231696 C15.2968407,16.7526843 15.7749964,16.7684353 16.1631464,16.5231696 C16.7020561,16.1833977 16.8629414,15.4712269 16.5231696,14.9323172 L15.5916096,13.4562223 C15.9606334,12.8633092 16.2362761,12.208517 16.4016617,11.508722 L18.100521,11.1250724 C18.520173,11.0294412 18.8700705,10.7020452 18.971327,10.2542664 C19.1119611,9.63322641 18.721561,9.01556168 18.100521,8.87492764 L16.4016617,8.49127796 Z"></path>
                        </svg>
                        </a>
                    </li>
                    <li className="listed">
                        <a className="profile-pn ">
                        <svg fill="#ff4548" stroke="none" height="26" viewBox="0 1 24 24" >
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                        </a>
                    </li>

                    {/* onClick={logout}  */} 
                    <li id="logout" className="listed">
                        <a className="profile-pn ">
                        <svg aria-hidden="true" fill="#ccc" width="26" height="26" viewBox="0 -1 20 20"><path d="M9 1a8 8 0 100 16A8 8 0 009 1zm.81 12.13c-.02.71-.55 1.15-1.24 1.13-.66-.02-1.17-.49-1.15-1.2.02-.72.56-1.18 1.22-1.16.7.03 1.2.51 1.17 1.23zM11.77 8c-.3.34-.65.65-1.02.91l-.53.37c-.26.2-.42.43-.5.69a4 4 0 00-.09.75c0 .05-.03.16-.18.16H7.88c-.16 0-.18-.1-.18-.15.03-.66.12-1.21.4-1.66.4-.49.88-.9 1.43-1.22.16-.12.28-.25.38-.39a1.34 1.34 0 00.02-1.71c-.24-.31-.51-.46-1.03-.46-.51 0-.8.26-1.02.6-.21.33-.18.73-.18 1.1H5.75c0-1.38.35-2.25 1.1-2.76.52-.35 1.17-.5 1.93-.5 1 0 1.79.18 2.49.71.64.5.98 1.18.98 2.12 0 .57-.2 1.05-.48 1.44z"></path></svg>
                        </a>
                    </li>
                </ul>
            </>

             {/* : */}
                 {/* <ol> */}
                     {/* <Link className="btn-ww l-mar-sm" to="/login">Login</Link> */}
                     {/* <Link className="nbtn-ww l-mar-sm" to="/signup">Sign Up</Link> */}
                 {/* </ol> */}
             {/* } */}

        </>
    )
}

export default UserPane