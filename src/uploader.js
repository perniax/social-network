import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "first",
            last: "last",
            id: "id",
            imageurl: "",
            bio: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleChange(e) {
        // console.log(e.targe.files);
        this.setState({ file: e.target.files[0] });
    }
    handleClick(e) {
        e.preventDefault();

        let formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/upload", formData)
            .then(response => {
                this.props.updatePicture(response.data);
                console.log("response from axios UPLOAD post: ", response);
            })
            .catch(function(err) {
                console.log("error from the axios UPLOAD post: ", err);
            });
    }
    render() {
        return (
            <div>
                <h3>You can change here your profile picture</h3>
                <input
                    onChange={this.handleChange}
                    type="file"
                    name=""
                    accept="image/*"
                />
                <button onClick={this.handleClick}> Upload </button>
            </div>
        );
    }
}
