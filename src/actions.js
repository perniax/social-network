import axios from "./axios";

export async function getPeople() {
    console.log("getPeople is running!");
    //here goes the server request
    const { data } = await axios.get("/getPeople");
    console.log("data from /getPeople in actions.js : ", data);

    return {
        //the action itself! every action has to have a variable called type that is a string:
        type: "GET_PEOPLE",
        //now the data that we want to pass to reduxPromise
        people: data
        // or just data, that creates an elemen called data with value data
    };
}

export async function makeFriend(id) {
    const { data } = await axios.post(`/acceptfriend/${id}`);
    console.log("data from /acceptfriend in actions.js : ", data);

    return {
        type: "MAKE_FRIEND",

        id
    };
}

export async function unfriend(id) {
    const { data } = await axios.post(`/deletefriend/${id}`);
    console.log("data from /deletefriend in actions.js : ", data);
    return {
        type: "DELETE_FRIEND",

        id
    };
}

export async function loadChatMessages(chat) {
    // const { data } = await axios.get(`/getchat/`);
    // console.log("data from /getchat in actions.js : ", data);
    return {
        type: "LOAD_CHAT",

        chatMessages: chat
    };
}

export async function newChatMessage(msg) {
    // const { data } = await axios.post(`/chatmessages/${id}`);
    // console.log("data  in actions.js : ", data);
    console.log("msg in action", msg);
    return {
        type: "CHAT_MESSAGE",

        chatMessages: msg
    };
}

// must return Objects, and what we are returning are actions!

// export function example() {
//     return {
//         type: "ACTION_THAT_WILL_CHANGE_A_THING"
//     };
// }
