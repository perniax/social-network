const spicedPg = require("spiced-pg");

//to run Heroku
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbuser, dbpass } = require("../secrets.json");
    db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/socialNetwork`);
}

exports.addUser = function(first, last, email, password) {
    return db
        .query(
            `INSERT INTO users (first, last, email, password)
        VALUES($1, $2, $3, $4)
        RETURNING id`,
            [first, last, email, password]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getHashedPassword = function(email) {
    return db
        .query(`SELECT password, id FROM users WHERE email=$1`, [email])
        .then(({ rows }) => {
            return rows;
        });
};

exports.getUser = function(id) {
    return db
        .query(`SELECT * FROM users WHERE id = $1`, [id])
        .then(({ rows }) => {
            return rows;
        });
};

exports.addImages = function(id, imageurl) {
    return db
        .query(
            `UPDATE users SET imageurl=$2 WHERE id=$1
        RETURNING *`,
            [id, imageurl]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.addBio = function(id, bio) {
    return db
        .query(
            `UPDATE users SET bio=$2 WHERE id=$1
        RETURNING *`,
            [id, bio]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getOtherUser = function(id) {
    return db
        .query(`SELECT * FROM users WHERE id = $1`, [id])
        .then(({ rows }) => {
            return rows;
        });
};

exports.findUsers = function() {
    return db
        .query(
            `SELECT * FROM users
            ORDER BY id DESC
            LIMIT 3`
        )
        .then(({ rows }) => rows);
};

exports.getMatchingFriends = function(val) {
    return db
        .query(
            `SELECT * FROM users
            WHERE first ILIKE $1;`,
            ["%" + val + "%"]
        )
        .then(({ rows }) => rows);
};

exports.firstApproachFriend = function(receiver_id, sender_id) {
    return db
        .query(
            `SELECT * FROM friendship WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1)`,
            [receiver_id, sender_id]
        )
        .then(({ rows }) => rows);
};

exports.addfriend = function(sender_id, receiver_id) {
    return db
        .query(
            `INSERT INTO friendship (sender_id, receiver_id) VALUES($1, $2)
            RETURNING *`,
            [sender_id, receiver_id]
        )
        .then(({ rows }) => rows);
};

exports.acceptfriend = function(sender_id, receiver_id) {
    return db
        .query(
            `UPDATE friendship SET accepted = TRUE WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1)
            RETURNING *`,
            [sender_id, receiver_id]
        )
        .then(({ rows }) => rows);
};

exports.deletefriend = function(sender_id, receiver_id) {
    return db
        .query(
            `DELETE FROM friendship WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1)`,
            [sender_id, receiver_id]
        )
        .then(({ rows }) => rows);
};

exports.getPeople = function(sender_id) {
    return db
        .query(
            `SELECT users.id, first, last, imageurl, accepted
    FROM friendship
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)`,
            [sender_id]
        )
        .then(({ rows }) => rows);
};
// return only the 'accepted' no matter true or false rows
//probably all accepted not null

exports.getChat = function() {
    return db
        .query(
            `SELECT users.imageurl, users.first, users.last, chats.message, chats.posted_date, chats.created_at, chats.id FROM chats
            JOIN users ON users.id = chats.sender_id
            ORDER BY chats.created_at DESC LIMIT 10 `
        )
        .then(({ rows }) => rows);
};

exports.addChatMessage = function(message, sender_id) {
    return db
        .query(
            `INSERT INTO chats (message, sender_id) VALUES ($1, $2)
            RETURNING *`,
            [message, sender_id]
        )
        .then(({ rows }) => rows);
};
