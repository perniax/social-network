import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPeople, makeFriend, unfriend } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        state =>
            state.people &&
            state.people.filter(people => people.accepted == true)
    );
    const wannabes = useSelector(
        state =>
            state.people &&
            state.people.filter(people => people.accepted == false)
    );
    // console.log("friends - last state on the reducer : ", friends);
    //
    // console.log("wannabes - last state on the reducer : ", wannabes);

    useEffect(() => {
        //to dispatch we pass the function defined in actions.js
        //the important is that disoatch is called in the component, could be after a event
        dispatch(getPeople());
    }, []);

    // [friends || wannabes]

    // if (!friends) {
    //     return null;
    // }

    return (
        <div className="friendsAndWannabes">
            <h1> Friends </h1>
            <span className="friendsList">
                {friends &&
                    friends.map(friends => {
                        return (
                            <div className="friends" key={friends.id}>
                                <img src={friends.imageurl} />
                                <p>
                                    {friends.first} {friends.last}
                                </p>
                                <button
                                    onClick={() =>
                                        dispatch(unfriend(friends.id))
                                    }
                                >
                                    Cancel Friendship
                                </button>
                            </div>
                        );
                    })}
            </span>
            <span className="wannabesList">
                <h1> Friend Requests </h1>
                {wannabes &&
                    wannabes.map(wannabes => {
                        return (
                            <div className="wannabes" key={wannabes.id}>
                                <img src={wannabes.imageurl} />
                                <p>
                                    {wannabes.first} {wannabes.last}
                                </p>
                                <button
                                    onClick={() =>
                                        dispatch(makeFriend(wannabes.id))
                                    }
                                >
                                    Add friend
                                </button>
                            </div>
                        );
                    })}
            </span>
        </div>
    );
}

// cuteAnimals.map(animal) we add a second argument for the keys, cause for each property will need a unique key,
//
// to force map to run only when cuteAnimals is not undefined, {cuteAnimals (when is defined) && (then do the run) cuteAnimals.map

// or if we want more properties
//
// {cuteAnimals && cuteAnimals.map((animal, index) => {
//     return (
//         <div key= {index>}
//         <p> {animal.name} </p>
//         <p> {animal.cutenessScore} </p>
//         </div>

//NOTES:
//
// next steps for part 8
// server stuff
//
// 3 routes
// GET /friends-wannabes route. This route will retrieve the list of friends and wannabes from db and send it back to client
// POST /accept-friendship route. You'll probably to use the route you wrote in part 7.
// POST /end-friendship route. You'll probably be able to use the route from part 7 as well.
// client side
//
// start.js
//
// setup Redux boilerplate (if you haven't done so already...)
// app.js
//
// add route to BrowserRouter for Friends component
// actions.js
//
// three action creator functions:
// receiveFriendsWannabes: will make GET request to server to retrieve the list of friends and wannabes
// note: if you get back an empty array, that eiter means (1) the query is wrong, or (2) you have no friends or wannabes :(
// should return an object with type property and a friendsWannabes property whose value is the array of friends and wannabes from the server
// acceptFriendRequest: will make POST request to the server to accept the friendship. The function should return an object with type property and the id of the user whose friendship was accepted.
// unfriend: will make POST to the server to end the friendship. It should return an object with type and the id of the user whose friendship was ended.
// reducer.js
//
// three conditionals:
// RECEIVE_FRIENDS_WANNABES: should clone the global state, and add to it a property called friendsWannabes whose value is the array of friends and wannabes
// ACCEPT_FRIEND_REQUEST: should clone the global state, and the clone should have all the properties of the old state except one of the objects in the friendsWannabes array should have their accepted property set to true. All done immutably :)
// UNFRIEND: should clone the global state, and the clone should have all the properties of the old state except the user whose friendship was ended should be removed from the friendsWannabes array. All done immutably :)
// Friends.js
//
// dispatch an action when it mounts. This action will fetch the list of friends and wannabes from the server and put it in Redux.
// we'll want to split the friendsWannabes array that's in Redux into two arrays - (1) array of wannabes and (2) array of friends
// we'll have to use the useSelector hook twice to accomplish this...
// then, render the two lists on screen using map
// for the accept friend request button... when it's clicked we'll want to dispatch our acceptFriendRequest action
// for the end friendship button... when it's clicked we'll want to dispatch the unfriend action
