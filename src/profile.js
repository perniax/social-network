import React from "react";

import ProfilePic from "./profilePic";
import BioEditor from "./BioEditor";

export default function Profile({ first, last, imageurl, bio, updateBio }) {
    console.log("bio and updateBiofrom profile.js: ", bio, updateBio);

    return (
        <div className="profile">
            <h1>
                {first} {last} `s Profile
            </h1>
            <ProfilePic first={first} last={last} imageurl={imageurl} />
            <BioEditor bio={bio} updateBio={updateBio} />
        </div>
    );
}
//BioEditor takes the info from Profile in App
