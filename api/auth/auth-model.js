const db = require("../../data/dbConfig");

function getUsers() {
  return db("users");
}

function findUserByUsername(username) {
  return db("users").where({ username }).first();
}

function findUserById(id) {
  return db("users").where({ id });
}

async function addUser(user) {
  const [id] = await db("users").insert(user);
  return findUserById(id).first();
}

module.exports = { getUsers, findUserByUsername, findUserById, addUser };
