import React from "react";
import { Route, Redirect } from "react-router-dom";


function AuthRoute({ component: Component, ...rest }) {

    /*
     * GET the current value of the AuthContext.Provider.
     * The <AuthRoute> components are updated when 
     * their parent <AuthContext> components are.
     */

    // TODO - or not todo
    return (
        <Route
        {...rest}
        render={ props =>
            1 ? (
            <Component {...props} />
            ) : (
            <Redirect to="/login" />
            )
        }
        />
    );
}

export default AuthRoute;