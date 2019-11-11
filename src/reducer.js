export default function reducer(state = {}, action) {
    // a serie of IF stataments, one per action
    if (action.type == "GET_PEOPLE") {
        //then change redux state
        console.log("GET_PEOPLE in reducer: ", action);
        //in actions connect to the reducer the type and the data

        //* and now we clone the global redux state {...OBJ-TO-CLONE}, after the , we add the properties
        state = {
            ...state,
            people: action.people
        };
    }

    if (action.type == "MAKE_FRIEND") {
        console.log("MAKE_FRIEND in reducer: ", action);
        state = {
            ...state,
            people: state.people.map(people => {
                if (people.id != action.id) {
                    return people;
                } else {
                    return {
                        ...people,
                        accepted: true
                    };
                }
            })
        };
    }

    if (action.type == "DELETE_FRIEND") {
        console.log("DELETE_FRIEND in reducer: ", action);
        state = {
            ...state,
            people: state.people.filter(people => people.id != action.id)

            // filter() to take the user out of the array of "people"
        };
    }

    if (action.type == "LOAD_CHAT") {
        console.log("LOAD_CHAT in reducer: ", action);
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }

    if (action.type == "CHAT_MESSAGE") {
        console.log("CHAT_MESSAGE in reducer: ", action);
        console.log('state in "CHAT_MESSAGE"/reducer.js: ', state);

        // state = {
        //     ...state,
        //     chatMessages: action.chatMessages
        // };

        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.chatMessages[0]]
        };
    }

    console.log("state, this is the new global state!! : ", state);
    return state;
}

// to finally passed to the screen, we use the useSelector in the component (cuteAnimals)to be rendered via useSelector

// export default function reducer(state = {}, action) {
//     // a serie of IF stataments, one per action
//     if (action.type == "ACTION_THAT_WILL_CHANGE_A_THING") {
//         //then change redux state
//     }
//     return state;
// }
