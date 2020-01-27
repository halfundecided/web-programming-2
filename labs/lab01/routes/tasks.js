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
