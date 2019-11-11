import React from "react";
import axios from "./axios";
import { Link, BrowserRouter, Route } from "react-router-dom";

import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";
import Friends from "./friends";
import Chat from "./chat";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "first",
            last: "last",
            id: "id",
            imageurl: "",
            bio: "",
            file: "",
            uploaderIsVisible: false
        };
        this.showModal = this.showModal.bind(this);
        this.updatePicture = this.updatePicture.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }
    componentDidMount() {
        console.log("App mounted!");
        axios.get("/profile").then(response => {
            // console.log("response from axios.get in /profile: ", response);
            // console.log(
            //     "response.data[0] from axios.get in /profile: ",
            //     response.data[0]
            // );
            // console.log(
            //     "response.data[0].bio from axios.get in /profile: ",
            //     response.data
            // );
            this.setState({
                first: response.data[0].first,
                last: response.data[0].last,
                imageurl: response.data[0].imageurl,
                bio: response.data[0].bio
            });
        });
    }
    // toggleModal() {
    //     this.setState({
    //         uploaderIsVisible: false
    //     });
    // }
    showModal() {
        this.setState({
            uploaderIsVisible: true
        });
    }
    updatePicture(dataFromAxiosUpload) {
        this.setState({
            imageurl: dataFromAxiosUpload
        });
    }
    updateBio(dataFromAxiosBio) {
        this.setState({
            bio: dataFromAxiosBio
        });
    }
    render() {
        return (
            <BrowserRouter>
                <div>
                    <div className="header">
                        <img className="logo" src="/img/octagonoLogo.png" />

                        <h1 className="welcomeMessageLetters">Octagon</h1>

                        <Link to="/"> Home </Link>

                        <Link to="/friends"> Friends </Link>

                        <Link to="/chat"> Chat </Link>

                        <Link to="/users"> Find Friends </Link>

                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            imageurl={this.state.imageurl}
                            showModal={this.showModal}
                        />
                    </div>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <div>
                                {this.state.uploaderIsVisible && (
                                    <Uploader
                                        updatePicture={this.updatePicture}
                                    />
                                )}
                                <div>
                                    <Profile
                                        first={this.state.first}
                                        last={this.state.last}
                                        imageurl={this.state.imageurl}
                                        bio={this.state.bio}
                                        updateBio={this.updateBio}
                                    />
                                </div>
                            </div>
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={props => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route
                        path="/users"
                        render={props => (
                            <FindPeople
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route
                        path="/friends"
                        render={props => (
                            <Friends
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route
                        path="/chat"
                        render={props => (
                            <Chat
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                </div>
            </BrowserRouter>
        );
    }
}
