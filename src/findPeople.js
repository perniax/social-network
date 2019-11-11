import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [matchingUsers, setMatchingUsers] = useState();

    useEffect(() => {
        axios
            .get("/otherusers")
            .then(response => {
                console.log("response from axios.get /otherusers: ", response);
                //**check the response should be an array with 3 friends,and then pass it to setUsers
                setUsers(response.data);
            })
            .catch(function(err) {
                console.log("error in axios.get /otherusers: ", err);
            });
    }, []);

    useEffect(() => {
        if (users.length != 0) {
            axios
                //pass on the route +matchingUsers to add the input to he route
                .get("/matchingFriends/" + matchingUsers)
                .then(result => {
                    setUsers(result.data);
                })
                .catch(function(err) {
                    console.log("error axios /matchingFriends: ", err);
                });
        }
    }, [matchingUsers]);
    // we add matchingUsers on the [] so the fn only runs when we write something in the input
    const handleUsersInput = e => {
        setMatchingUsers(e.target.value);
    };

    return (
        <div id="friendfinder">
            <h1>Find People</h1>

            <form>
                <input
                    placeholder="find people"
                    onChange={handleUsersInput}
                    defaultValue=""
                />
            </form>
            <div id="friendfinder">
                <h1>Checkout who also joined the Octagon!</h1>
                <ul>
                    {users.map(users => (
                        <div className="findPeople" key={users.id}>
                            <li>
                                <img src={users.imageurl} />
                                <h2>
                                    {users.first} {users.last}
                                </h2>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}
