import axios from 'axios'

async function setter(key, val) {

    let payload = {
        key : key,
        val : val
    }

    console.log("SETTER FIRING")

    await axios
        .post('/api/redis/set', payload)
        .then( res => {
            console.log("[REDIS] finished request to setter")
            let body = res.body;
            console.log(res);
            return true
        }).catch( err => {
            console.log("[Redis] ERROR 123")
            return err
        });

    // return result;
}

async function getter(token) {
    
    let payload = {
        key : token
    }

    const result = await axios
        .post('/api/redis/get', payload)
        .then( res => { 
            console.log("Response from Redis GET")
            console.log(res)
            return res
        }).catch( err => {
            return err
        })

    return result
}

export {setter, getter}