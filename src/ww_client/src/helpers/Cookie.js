    import axios from 'axios'

    const c_names = {
        SESSION_COOKIE:"ww_session_uint",
        AUTH_COOKIE:"ww_front_uint"
    }

    // const setCookie = function(cname, cvalue, extime, seconds=false){
    //     console.log("FIRST CHECK")
    //     console.log(cvalue)
    //     var d = new Date();
    //     if (seconds) { // Set in seconds
    //         d.setTime(d.getTime() + (extime * 60 * 1000));
    //     } else { // Set in days (Default)
    //         d.setTime(d.getTime() + (extime * 24 * 60 * 60 * 1000));
    //     }
    //     var expires = "expires="+d.toUTCString();
    //     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=None" + ";Secure=False";
    //     console.log("DOCUMENT COOKIE ANALYZE")
    //     console.log(document.cookie)

    //     return getCookie (cname) || null;
    // }
      
    const getCookie = (cname) => {
        // console.log("Call to GetCookie!")
        var name = cname + "=";

        var ca = document.cookie.split(';');

        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                // console.log("GOT COOKIE!")
                // console.log(c.substring(name.length, c.length))
                return c.substring(name.length, c.length);
            }
        }
        console.log("No Cookie")
        return "";
    }

    const delCookie = (cname) => {
        var d = new Date();
        d.setTime(d.getTime() - 100);
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + "" + ";" + expires + ";path=/" + ";SameSite=None";
    }

    // Communicate w/ Redis cache
    async function renew () {

        /**
         * Renew the session
         * The ww_front_uint cookie expires every 15 minutes.
         * The user's Redis cache expires every 30 minutes.
         * 
         */

        var val = await axios.post('/accounts/renew', {refresh: getCookie(c_names.SESSION_COOKIE)}, {
            proxy: {
                host: 'localhost',
                    port: 4000
            }
        })
        .then( res => {
            return res
        }).catch( err => {
            console.log("Error renewing renewable")
            console.log(err)
        })

        // console.log("RETURNING RENEWABLE")
        // console.log(val)
        if (val.status == 200) {
            return val.data
        }

    }

    // Communicate w/ Redis cache
    async function verify () {

        /**
         * Renew the session
         * The ww_front_uint cookie expires every 15 minutes.
         * The user's Redis cache expires every 30 minutes.
         * 
         */

        // console.log("HEY THERE")
        // console.log(getCookie(c_names.SESSION_COOKIE))

        var val = await axios.post('/accounts/verify', {
            sess: getCookie(c_names.SESSION_COOKIE), 
        }, {
            proxy: {
                host: 'localhost',
                    port: 4000
            }
        })
        .then( res => {
            return res
        }).catch( err => {
            console.log("Error verifying")
            console.log(err)
        })

        // console.log("VAL")
        // console.log(val)
        if (val.status == 200) {
            // console.log("Verified!")
            return val.data
        }
        
    }

export {getCookie, delCookie, renew, verify, c_names}