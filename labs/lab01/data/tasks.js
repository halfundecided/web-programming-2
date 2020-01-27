const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const { ObjectId } = require("mongodb");

const getAll = async (skip, take) => {
  const taskCollection = await tasks();
  const allTasks = await taskCollection
    .find({})
    .project({ _id: 0 })
    .skip(skip)
    .limit(take)
    .toArray();
  return allTasks;
};

module.exports = {
  getAll
};
