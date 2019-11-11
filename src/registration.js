import React from "react";
import axios from "./axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: false };
        this.handleInput = this.handleInput.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
        axios
            .post("/registration", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password
            })
            .then(result => {
                console.log("data from the axios post: ", result);
                // console.log("result.data.success: ", result.data.success);
                // console.log("result.success: ", result.success);

                if (result.data.success == true) {
                    location.replace("/");
                } else {
                    this.setState(
                        {
                            error: true
                        },
                        () =>
                            console.log(
                                "callback function from setState in axios REGISTRATION post"
                            )
                    );
                }
            })
            .catch(function(err) {
                console.log("error in axios REGISTRATION post: ", err);
            });
    }
    render() {
        return (
            <div>
                {this.state.error && (
                    <p> Something went wrong. Please try again! </p>
                )}
                <form>
                    <input
                        name="first"
                        type="text"
                        placeholder="First Name"
                        onChange={this.handleInput}
                    />
                    <br></br>
                    <input
                        name="last"
                        type="text"
                        placeholder="Last Name"
                        onChange={this.handleInput}
                    />

                    <br></br>

                    <input
                        name="email"
                        type="text"
                        placeholder="e-mail"
                        onChange={this.handleInput}
                    />
                    <br></br>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={this.handleInput}
                    />
                    <button onClick={this.handleClick}> Submit </button>
                </form>
            </div>
        );
    }
}
