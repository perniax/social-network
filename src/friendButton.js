import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        console.log("props.otherUser: ", props.otherUser);
        // console.log("props.otherProfile.id: ", props.otherProfile.id);
        axios
            .get("/arewefriends/" + props.otherUser)
            .then(response => {
                console.log("response from /arewefriends: ", response);

                if (response.data.length == 0) {
                    setButtonText("Add Friend");
                } else if (response.data[0].accepted == false) {
                    //check in response that accepted=false and add the condition
                    setButtonText("Accept Friend");
                } else if (response.data[0].accepted == true) {
                    setButtonText("Cancel Friendship");
                }
            })
            .catch(function(err) {
                console.log("error axios /arewefriends: ", err);
            });
    }, []);

    const handleButtonClick = e => {
        setButtonText(e.target.value);

        console.log("click in handleButtonClick worked!", e);

        if (buttonText == "Add Friend") {
            axios
                .post("/addfriend/" + props.otherUser)
                .then(response => {
                    console.log("response from /addfriend: ", response);
                    console.log("response.data /addfriend: ", response.data);
                    console.log(
                        "response.data[0] /addfriend: ",
                        response.data[0]
                    );
                    console.log(
                        "response.data[0].accepted /addfriend: ",
                        response.data[0].accepted
                    );
                    if (response.data[0].accepted == false) {
                        setButtonText("Cancel friend request");
                    }
                })
                .catch(function(err) {
                    console.log("error in the /addfriend:", err);
                });
        } else if (buttonText == "Accept Friend") {
            axios
                .post("/acceptfriend/" + props.otherUser)
                .then(response => {
                    console.log("response from /acceptfriend: ", response);
                    console.log("response.data /acceptfriend: ", response.data);
                    console.log(
                        "response.data[0].accepted /acceptfriend: ",
                        response.data[0].accepted
                    );
                    if (response.data[0].accepted == true) {
                        setButtonText("Cancel Friendship");
                    }
                })
                .catch(function(err) {
                    console.log("error in the /acceptfriend:", err);
                });
        } else if (
            buttonText == "Cancel Friendship" ||
            buttonText == "Cancel friend request"
        ) {
            axios
                .post("/deletefriend/" + props.otherUser)
                .then(response => {
                    console.log("response from /deletefriend: ", response);
                    console.log(
                        "response.data from /deletefriend: ",
                        response.data
                    );
                    if (response.data.length == 0) {
                        setButtonText("Add Friend");
                    }
                })
                .catch(function(err) {
                    console.log("error in the /deletefriend", err);
                });
        }
    };

    return (
        <div>
            <h3> This is the friend-button component </h3>
            <button onClick={handleButtonClick}>{buttonText}</button>
        </div>
    );
}
