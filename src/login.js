import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
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
        console.log("this.state.email: ", this.state.email);
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(result => {
                console.log("result from axios LOGIN post : ", result);
                if (result.data.success == true) {
                    location.replace("/");
                } else {
                    this.setState(
                        {
                            error: true
                        },
                        () =>
                            console.log(
                                "callback function from setState in axios LOGIN post"
                            )
                    );
                }
            })
            .catch(function(err) {
                console.log("error in login axios login post: ", err);
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
                        name="email"
                        type="text"
                        placeholder="e-mail"
                        onChange={this.handleInput}
                    />
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
