import React from "react";
import axios from "./axios";

// import ProfilePic from "./profilePic";
// import Profile from "./profile";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "first",
            last: "last",
            id: "id",
            imageurl: "",
            bio: "",
            editedBio: false
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.showBioEditor = this.showBioEditor.bind(this);
    }
    handleInput(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log("this.state: ", this.state)
        );
    }
    handleClick(e) {
        e.preventDefault();
        // console.log("this.props from bioEditor handleClick: ", this.props);
        // console.log("this.state.bio for axios post BIO: ", this.state.bio);
        axios
            .post("/bio", {
                bio: this.state.bio
            })
            .then(response => {
                this.props.updateBio(response.data);
                console.log("response from axios post BIO: ", response);
                this.setState({
                    editedBio: false
                });
            })
            .catch(function(err) {
                console.log("error from the axios BIO post: ", err);
            });
    }
    showBioEditor() {
        this.setState({
            editedBio: true
        });
    }
    render() {
        let elem;
        if (this.state.editedBio) {
            elem = (
                <div>
                    <h1>Bio</h1>
                    <h2>{this.props.bio}</h2>
                    <textarea
                        name="bio"
                        onChange={this.handleInput}
                        defaultValue={this.props.bio}
                    />
                    <button onClick={this.handleClick}> Add </button>
                </div>
            );
        } else {
            elem = (
                <div>
                    <h1>Bio</h1>
                    <h2>{this.props.bio}</h2>
                    <button onClick={this.showBioEditor}> Edit </button>
                </div>
            );
        }
        return elem;
    }
}
