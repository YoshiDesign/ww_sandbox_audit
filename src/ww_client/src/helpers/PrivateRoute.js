// import React, {useContext} from 'react' 
// import {Route, Redirect} from 'react-router-dom'
// import {AuthContext} from '../App'

// function PrivateRoute({ children, ...rest }) {

//     const authContext = useContext(AuthContext)

//     console.log("AUTH CONTEXT");
//     console.log(authContext)
//     console.table(authContext)

//     console.log("2")
//     return (
//         <Route
//         {...rest}
//         render={({ location }) =>
//             authContext.user ? (
//             children
//             ) : (
//             <Redirect
//                 to={{
//                 pathname: "/login",
//                 state: { from: location }
//                 }}
//             />
//             )
//         }
//         />
//     );
// }

// export default PrivateRoute