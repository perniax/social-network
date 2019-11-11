import React from "react";

export default function ProfilePic(props) {
    console.log("imageurl: ", props.imageurl);
    let imageurl = props.imageurl || "/img/default.jpg";
    return (
        <div className="profilePicHeader">
            <img onClick={props.showModal} src={imageurl} />
            <h2>
                {" "}
                {props.first} {props.last}{" "}
            </h2>
        </div>
    );
}
