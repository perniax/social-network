import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);
    console.log("here are my last 10 chat messages: ", chatMessages);
    //at the begining will be undefined
    const keyCheck = e => {
        console.log("e.key key was pressed!: ", e.key);
        if (e.key == "Enter") {
            e.preventDefault();
            console.log(e.target.value);
            socket.emit("chatMessage", e.target.value);
            e.target.value = "";
        }
    };

    const elemRef = useRef();

    useEffect(() => {
        console.log("chat mounted!");
        console.log("elemRef: ", elemRef.current);
        console.log("scroll top", elemRef.current.scrollTop);
        console.log("scroll height: ", elemRef.current.scrollHeight);
        console.log("client height: ", elemRef.current.clientHeight);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    return (
        <div className="chat-messages" ref={elemRef}>
            <h1 className="chatHeather"> Chat Room </h1>
            {chatMessages &&
                chatMessages.map(chatMessages => {
                    return (
                        <div className="chat" key={chatMessages.id}>
                            <span className="chatBoxFirstLine">
                                <span className="chatImageContainer">
                                    <img
                                        className="chatImg"
                                        src={chatMessages.imageurl}
                                    />
                                </span>
                                <h2 className="nameInChat">
                                    {chatMessages.first} {chatMessages.last}
                                </h2>{" "}
                                <h3> {chatMessages.created_at} </h3>
                            </span>
                            <p> {chatMessages.message} </p>
                        </div>
                    );
                })}
            <textarea
                placeholder="Add you message here"
                onKeyDown={keyCheck}
                className="chatLetters"
            />
        </div>
    );
}
