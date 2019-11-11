import React from "react";
import ReactDOM from "react-dom";
import * as io from "socket.io-client";

import { init } from "./socket";

import Welcome from "./welcome";
import App from "./app";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";

import reducer from "./reducer";

const socket = io.connect();

socket.on("hi", ({ msg }) => {
    console.log(msg);
    socket.emit("howAreYou", {
        msg: "how are you?"
    });
});

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;

if (location.pathname === "/welcome") {
    elem = <Welcome />;
    // if user is on /welcome route, that means user is NOT logged in
    // and we should render the Registration component.
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
    // elem = <img src="octagon.jpg" />;
}
// // if else runs, that means user IS logged in. For now we will just render an img

ReactDOM.render(elem, document.querySelector("main"));
