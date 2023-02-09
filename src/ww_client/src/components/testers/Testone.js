import React, {useState, useEffect} from 'react'

function Testone() {


    const [loading, setLoading] = useState(true)
    
    return (
        <>
            {loading ? 
                <p>Derp</p>
            : 

            <p>Hello!!</p>
            }
        </>
    )
}

export default Testone
