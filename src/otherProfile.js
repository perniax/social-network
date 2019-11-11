import React from "react";
import axios from "./axios";

import FriendButton from "./friendButton";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "first",
            last: "last",
            id: "id",
            imageurl: "",
            bio: "",
            otherUser: ""
        };
    }
    componentDidMount() {
        console.log("App mounted!");

        axios
            .get("/user/" + this.props.match.params.id + ".json")
            .then(response => {
                console.log("response axios otherProfile: ", response.data);
                if (response.data.success == false) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        first: response.data.first,
                        last: response.data.last,
                        imageurl: response.data.imageurl,
                        bio: response.data.bio
                    });
                }
            });
    }

    render() {
        return (
            <div className="otherProfile">
                <h1>
                    {" "}
                    Welcome to {this.state.first} {this.state.last} profile!{" "}
                </h1>
                <span className="otherProfilePicContainer">
                    <img src={this.state.imageurl} />
                </span>

                <h2> Bio: {this.state.bio} </h2>
                <FriendButton otherUser={this.props.match.params.id} />
            </div>
        );
    }
}
