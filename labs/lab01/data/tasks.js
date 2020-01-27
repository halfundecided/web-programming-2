const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const { ObjectId } = require("mongodb");

/**
 * Get a list of all tasks
 * @param {number} skip
 * @param {number} take
 */
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

/**
 * Get the task with the supplied ID
 * @param {objectId} id
 */
const getTaskById = async id => {
  if (typeof id === "undefined" || id.constructor !== String)
    throw `{id} invalid id`;

  const taskCollection = await tasks();
  const parsedId = ObjectId.createFromHexString(id);
  const thisTask = await taskCollection.findOne({ _id: parsedId });
  if (thisTask === null) throw "No task found with this id";

  return thisTask;
};

/**
 * Create a task
 * @param {string} title
 * @param {string} description
 * @param {number} hoursEstimated
 */
const createTask = async (title, description, hoursEstimated) => {
  if (
    typeof title === "undefined" ||
    typeof description === "undefined" ||
    typeof hoursEstimated === "undefined"
  )
    throw `one or more of arguments not provided`;
  if (title.constructor !== String) throw `Invalid title`;
  if (description.constructor !== String) throw `Invalid description`;
  if (hoursEstimated.constructor !== Number) throw `Invalid estimated hours`;

  const taskCollection = await tasks();

  const newTask = {
    title: title,
    description: description,
    hoursEstimated: hoursEstimated,
    completed: false,
    comments: []
  };

  const insertInfo = await taskCollection.insertOne(newTask);
  if (insertInfo.insertedCount === 0) throw `Could not add a new task`;

  return await taskCollection.findOne({
    _id: ObjectId(insertInfo.insertedId)
  });
};

/**
 * Update the task with the supplied Id: must provide all details of the new state of the object
 * @param {ObjectId} taskId
 * @param {Object} updatedTask
 */
const updateTask = async (taskId, updatedTask) => {
  if (typeof taskId === "undefined" || taskId.constructor !== String)
    throw `You should provide a valid id`;
  if (
    !updatedTask.title ||
    !updatedTask.description ||
    !updatedTask.hoursEstimated ||
    typeof updatedTask.completed === "undefined"
  )
    throw `You should provide all details (completed as well)`;
  if (
    updatedTask.title.constructor !== String ||
    updatedTask.description.constructor !== String ||
    updatedTask.hoursEstimated.constructor !== Number ||
    updatedTask.completed.constructor !== Boolean
  )
    throw `You should provide a proper input`;

  const originalTask = await module.exports.getTaskById(taskId);
  const taskCollection = await tasks();
  const parsedId = ObjectId.createFromHexString(taskId);

  const updatedTaskObject = {
    title: updatedTask.title,
    description: updatedTask.description,
    hoursEstimated: updatedTask.hoursEstimated,
    completed: updateTask.completed,
    comments: originalTask.comments
  };

  const updatedInfo = await taskCollection.updateOne(
    { _id: parsedId },
    { $set: updatedTaskObject }
  );

  if (updatedInfo.modifiedCount === 0)
    throw "could not update task successfully";

  return await module.esports.getTaskById(taskId);
};
module.exports = {
  getAll,
  getTaskById,
  createTask,
  updateTask
};
