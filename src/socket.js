import * as io from "socket.io-client";
import { newChatMessage, loadChatMessages } from "./actions";

export let socket;

export function init(store) {
    if (!socket) {
        socket = io.connect();
        //All dispatches of actions will go here!!

        socket.on("chatFromServer", chat => {
            console.log(
                "got message from the from the front end. About to start Redux stuff by dispaching in action!",
                { chat }
            );
            // console.log("msg/data received in socket.js: ", msg);
            store.dispatch(loadChatMessages(chat));
        });

        socket.on("messageFromServer", msg =>
            store.dispatch(newChatMessage(msg))
        );
    }
}
