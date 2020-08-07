const db = require("../db-config");

function find() {
  return db("users");
}

function findById(id) {
  return db("users").where({ id }).first();
}

function findByUsername(username) {
  return db("users").where({ username }).first();
}

function add(user) {
  return db("users")
    .insert(user)
    .then((res) => {
      return findById(res[0]);
    });
}

async function update(changes, id) {
  const update = await db("users").where({ id }).update(changes);
  return findById(update[0]);
}

async function remove(id) {
  const deletedNum = await db("users").where({ id }).del();
  return deletedNum;
}

module.exports = {
  find,
  findById,
  findByUsername,
  add,
  update,
  remove,
};
