const express = require("express");
const router = express.Router();
const data = require("../data");
const taskData = data.tasks;

/**
 * GET /api/tasks
 * Shows a list of tasks
 * By default, it will show the first 20 tasks in the collection.
 * If a querystring variable ?skip=n is provided, you will skip the first n tasks.
 * If a querystring variable ?take=y is provided, it will show y number of results.
 * By default, the route will show up to 20 tasks; at most it will show 100 tasks.
 */

router.get("/", async (req, res) => {
  let skipinRoute = 0;
  let takeinRoute = 0;

  if (!req.query.skip) {
    skipinRoute = 0;
  } else {
    skipinRoute = parseInt(req.query.skip);
  }
  // by default, it shows 20 tasks
  if (!req.query.take) {
    takeinRoute = 20;
  } else {
    takeinRoute = parseInt(req.query.take);
  }
  if (takeinRoute < 0) {
    takeinRoute = 20;
  }
  // maximum
  if (takeinRoute > 100) {
    takeinRoute = 100;
  }

  try {
    const allTask = await taskData.getAll(skipinRoute, takeinRoute);
    res.json(allTask);
  } catch (e) {
    res.sendStatus(500).json({ error: e });
  }
});

/**
 * GET /api/tasks/:id
 * Shows the task with the supplied ID
 */
router.get("/:id", async (req, res) => {
  try {
    const task = await taskData.getTaskById(req.params.id);
    res.status(200).json(task);
  } catch (e) {
    res.status(404).json({ error: "Task not found" });
  }
});

/**
 * POST /api/tasks
 * Creates a task with the supplied detail and returns created object
 * fails request if not all details supplied
 */

router.post("/", async (req, res) => {
  const taskInfo = req.body;

  if (!taskInfo) {
    res.status(400).json({ error: "You must provide data to create a task" });
    return;
  }
  if (!taskInfo.title) {
    res.status(400).json({ error: "You must provide a title" });
    return;
  }
  if (!taskInfo.description) {
    res.status(400).json({ error: "You must provide a description" });
    return;
  }
  if (!taskInfo.hoursEstimated) {
    res.status(400).json({ error: "You must provide estimated hours" });
    return;
  }

  try {
    const newTask = await taskData.createTask(
      taskInfo.title,
      taskInfo.description,
      taskInfo.hoursEstimated
    );
    res.sendStatus(200).json(newTask);
  } catch (e) {
    res.sendStatus(500).json({ error: e });
  }
});

/**
 * Updates the task with the supplied ID and returns the new task object
 * task: PUT calls must provide all details of the new state of the object
 * Note: you cannot manipulate comments in this route
 */
router.put("/:id", async (req, res) => {
  let taskInfo = req.body;
});
