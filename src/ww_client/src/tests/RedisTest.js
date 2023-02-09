import React, { Component } from "react";

class RedisTest extends Component {

    setter() {
        console.log("?");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"message":"Null"})
        };

        fetch('/api/redisTEST/set', requestOptions).then( res => {
            console.log("done");
        });
    }

    getter() {
        console.log("Redis Testing!");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"message":"Null"})
        };

        fetch('/api/redisTEST/get', requestOptions).then( res => {
            console.table(res.body);
        });
    }

    render () {
        return ( 
            <div>
                <button className="btn btn-info" onClick={this.setter}>Set Me</button>
                <button className="btn btn-info" onClick={this.getter}>Get Me</button>
            </div>
        );
    }

}

export default RedisTest;