const express = require("express");
const app = express();
const compression = require("compression");
const s3 = require("./s3");
const config = require("./config");
//socket.io
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
//to deploy e.g in heroku   myapp.herokuapp.com:* - added to the origins above
// and we change add for server in server.listen(8080.. in the bottton
const csurf = require("csurf");
const db = require("./utils/db");
const cookieSession = require("cookie-session");
let { hash, compare } = require("./utils/bc");

//*********************FILE UPLOAD BOILERPLATE**********************
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//*********************FILE UPLOAD BOILERPLATE********************
app.use(compression());

app.use(express.json());

// app.use(
//     cookieSession({
//         secret: `Hakuna_Matata`,
//         maxAge: 1000 * 60 * 60 * 24 * 30
//     })
// );

// const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `Hakuna_Matata`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

//new
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(express.static("./public"));

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
//********************

app.post("/registration", (req, res) => {
    hash(req.body.password)
        .then(hashedPass => {
            console.log("hashedPass: ", hashedPass);
            db.addUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPass
            )
                .then(result => {
                    // console.log("result from addUser: ", result);
                    console.log(
                        "return from addUser result[0].id: ",
                        result[0].id
                    );
                    //**COOKIE userId***
                    req.session.userId = result[0].id;
                    console.log("req.session.userId: ", req.session.userId);
                    res.json({
                        success: true
                    });
                })
                .catch(err => {
                    console.log("error with the registration /addUser : ", err);
                    res.json({
                        success: false
                    });
                });
        })
        .catch(err => console.log("error in hashedPass", err));
});
///******
app.post("/login", (req, res) => {
    console.log("req.body.email in login page: ", req.body.email);
    db.getHashedPassword(req.body.email)
        .then(result => {
            console.log("result from getHashedPassword: ", result);
            console.log("hashedPassword: ", result[0].password);
            console.log(
                "id from the user that comes from hashedPass: ",
                result[0].id
            );

            compare(req.body.password, result[0].password)
                .then(match => {
                    if (match == true) {
                        //** SET COOKIE after matching password**
                        req.session.userId = result[0].id;
                        console.log("the hashedPassword matched!: ", match);
                        res.json({
                            success: true
                        });
                    } else {
                        console.log(
                            ("the hashedPassword did NOT matched: ", match)
                        );
                        res.json({
                            success: false
                        });
                    }
                })
                .catch(error =>
                    console.log("login error match pass in login: ", error)
                );
        })
        .catch(error => console.log("error from getHashedPassword: ", error));
});
//**********
app.get("/profile", (req, res) => {
    const userId = req.session.userId;
    db.getUser(userId)
        .then(result => {
            // console.log("response from getUser query: ", result);
            res.json(result);
        })
        .catch(e => {
            console.log("error from getUser: ", e);
        });
});
//**********

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const url = config.s3Url + filename;
    const userId = req.session.userId;
    console.log("url from app.post /upload: ", url);
    // console.log("config: ", config);
    // const { title, username, description } = req.body;
    if (req.file) {
        // console.log("url before addImage:", url);
        db.addImages(userId, url)
            .then(result => {
                // console.log("result from addImages: ", result);
                // console.log("result[0]: ", result[0]);
                console.log("result[0].imageurl: ", result[0].imageurl);
                res.json(result[0].imageurl);
            })
            .catch(err => {
                console.log("error from addImages in /upload POST: ", err);
            });
    } else {
        res.json({
            success: false
        });
    }
});
//******************

app.post("/bio", (req, res) => {
    const userId = req.session.userId;
    console.log("req.body.bio in app.post /BIO :", req.body.bio);
    const bio = req.body.bio;
    db.addBio(userId, bio)
        .then(result => {
            console.log("result from addBio: ", result);
            // console.log("result[0] from addBio: ", result[0]);
            console.log("result[0].bio from addBio: ", result[0].bio);
            res.json(result[0].bio);
        })
        .catch(e => {
            console.log("error from addBio: ", e);
        });
});
//***************

app.get("/user/:id.json", (req, res) => {
    const userId = req.session.userId;
    let id = req.params.id;
    // console.log("id used in the OtherProfile express get: ", id);
    db.getOtherUser(id)
        .then(result => {
            // console.log("response from express OtherProfile: ", result);
            // if the user doent exists the response is empty [], and if the same user the id is the cookie!
            if (result.length == 0 || result[0].id === userId) {
                res.json({
                    success: false
                });
            } else {
                res.json(result[0]);
            }
        })
        .catch(e => {
            console.log("error from getOtherUser for OtherProfile: ", e);
        });
});

//*******************

app.get("/otherusers", (req, res) => {
    const userId = req.session.userId;
    db.findUsers(userId)
        .then(result => {
            // console.log("response from /friends in findPeople: ", result);
            // console.log("response[0] from /friends in findPeople: ", result[0]);
            res.json(result);
        })
        .catch(e => {
            console.log("error from /otherusers in findPeople: ", e);
        });
});
//*****************

app.get("/matchingFriends/:val", (req, res) => {
    let val = req.params.val;
    console.log("val from /otherusers: ", val);
    db.getMatchingFriends(val)
        .then(result => {
            console.log(
                "response from /matchingFriends in findPeople: ",
                result
            );
            // console.log("response[0] from /friends in findPeople: ", result[0]);
            res.json(result);
        })
        .catch(e => {
            console.log("error from /matchingFriends in findPeople: ", e);
        });
});

//*****************************
//Friend button routes:
//*****************************

app.get("/arewefriends/:val", (req, res) => {
    let val = req.params.val;
    console.log("val in /arewefriends: ", val);
    const userId = req.session.userId;
    console.log("cookie in /arewefriends: ", userId);
    db.firstApproachFriend(val, userId)
        .then(result => {
            console.log("response from /arewefriends: ", result);
            console.log("response[0] from /arewefriends: ", result[0]);
            res.json(result);
        })
        .catch(e => {
            console.log("error from /arewefriends: ", e);
        });
});

app.post("/addfriend/:val", (req, res) => {
    let val = req.params.val;
    console.log("val in /addfriend: ", val);
    const userId = req.session.userId;
    console.log("Cookie! req.session.userId: ", req.session.userId);
    db.addfriend(userId, val)
        .then(result => {
            console.log("**result from /addfriend**: ", result);
            // NO!! console.log("**result from /addfriend**: ", result[0]);
            // console.log("**result.data from /addfriend**: ", result.data);
            res.json(result);
        })
        .catch(e => {
            console.log("**error from /addfriend**: ", e);
        });
});

app.post("/acceptfriend/:val", (req, res) => {
    let val = req.params.val;
    // console.log("val in /addfriend: ", val);
    const userId = req.session.userId;
    // console.log("Cookie! req.session.userId: ", req.session.userId);
    db.acceptfriend(val, userId)
        .then(result => {
            console.log("**result from /acceptfriend**: ", result);
            res.json(result);
        })
        .catch(e => {
            console.log("**error from /acceptfriend**: ", e);
        });
});

app.post("/deletefriend/:val", (req, res) => {
    let val = req.params.val;
    // console.log("val in /addfriend: ", val);
    const userId = req.session.userId;
    // console.log("Cookie! req.session.userId: ", req.session.userId);
    db.deletefriend(userId, val)
        .then(result => {
            // console.log("**result from /deletefriend**: ", result);
            res.json(result);
        })
        .catch(e => {
            console.log("**error from /deletefriend**: ", e);
        });
});

//**********

app.get("/getPeople", (req, res) => {
    const userId = req.session.userId;
    console.log("req.session.userId: ", req.session.userId);
    db.getPeople(userId)
        .then(result => {
            console.log("result from /getPeople: ", result);
            res.json(result);
        })
        .catch(e => {
            console.log("error from /getPeople: ", e);
        });
});

///***LAST ROUTE LEAVE IT BELLOW***
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

//***

io.on("connection", socket => {
    console.log(`a socket with the id ${socket.id} just connected`);
    // first IF, if user is not logIn --> disconnect
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    let userId = socket.request.session.userId;

    db.getChat().then(data => {
        // console.log("result from /getChat: ", data);
        data.reverse();
        io.sockets.emit("chatFromServer", data);
    });

    socket.on("chatMessage", msg => {
        console.log("chatMessage comes from chat.js:", msg);
        db.addChatMessage(msg, userId).then(msg => {
            // console.log("result from /addChat: ", msg);

            db.getUser(userId).then(user => {
                // console.log("data get user for the chat:", user);
                var chat = [
                    {
                        message: msg[0].message,
                        created_at: msg[0].created_at,
                        first: user[0].first,
                        last: user[0].last,
                        imageurl: user[0].imageurl,
                        id: msg[0].id
                    }
                ];
                console.log("***chat: ", chat);
                io.sockets.emit("messageFromServer", chat);
            });
        });
    });

    socket.on("disconnect", () => {
        console.log(`a socket with the id ${socket.id} just disconnected`);
    });
});
//**this was under db.addChatMessage
// db.getChat().then(data => {
//     // console.log("result from /getChat: ", data);
//     data.reverse();
//     io.sockets.emit("chatFromServer", data);
// });

//starts the request
// socket.on("my chat message that comes from the emit in chatJs", msg => {
//     app.get("/getChat", (req, res) => {
//         db.getchat()
//             .then(msg => {
//                 console.log("result from /getchat: ", msg);
//                 res.json(msg);
//             })
//             .catch(e => {
//                 console.log("error from getchat: ", e);
//             });
//     });
//     io.sockets.emit("chatMessages from the server : ", msg);
// });
//     console.log("data from /getchat in actions.js : ", data);
// console.log("message received!");
// console.log("and this is the message: ", msg);

//1. we need to make a DB query..to get the last 10 messages..
//so we'll need a table *chats* on the photos
//d.getLastTenMessages().then()data=>{
//here comes the EMIT those chat messages
// console.log(data.rows); --> this should be an array with the messages
//something like : io.socket.emit('chatMessages', data.rows)
//})
//2. Deal with the new message, e.event when we hit enter sends the msgs
//something like: socket.on('new message', (call back fun (msg)) => {
// i.get all the info about the user i.e db query, and pass the userId ( socket.request.session.userId)
// (each message shows the picture, date, and the msg)
//ii. add the chat msg to DB
//iii. could create a chat msg obj, and send it OR just send the whole info from the table (query above
//iv. io.socket.emit(newChatMessage)
// i.e :  socket.on(
//         'newSOCKETChatMessage',
//         msg => store.dispatch(
//             newChatMessage(msg)
//         )
//     );
// })
// }

//to send msg to a specific socket:
// io.sockets.sockets['id of the socket'].emit('HeyFriedman')

//to send to all sockets except one;
// socket.broadcast.emit('whatever');

// socket.emit("chatMessage", {
//     msg: "hello there"
// });

// socket.on("howAreYou", ({ msg }) => console.log(msg));
