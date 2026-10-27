const express = require("express");
const router = express.Router();

const generateTasks = require("../services/bedrock");
const {saveTasksToDynamo,getTasksFromDynamo}= require("../services/dynamo");


console.log("saveTasksToDynamo", saveTasksToDynamo);
router.post("/generate",
async (req,res)=>{

  const { goal } = req.body;

  const result =
    await generateTasks(goal);

  res.json(result.tasks);
});
router.post("/save",
async (req,res)=>{
  try{
  console.log("Received save request:", req.body);
  const { goal,tasks } = req.body;

  const result = await saveTasksToDynamo(goal, tasks);

  res.json(result);
} catch (error) {
  console.error("Error saving tasks:", error);
  res.status(500).json({ error: "Failed to save tasks" });
}
});

router.get("/tasks",async(req,res)=>{
  try{
    const tasks = await getTasksFromDynamo();
    res.json(tasks);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});
router.get("/tasks/:goalId", async (req, res) => {

  const { goalId } = req.params;

  try {

    const tasks =
      await getTasksFromDynamo();

    const task =
      tasks.find(
        item => item.goalId === goalId
      );

    res.json(task);

  } catch (error) {

    console.error(
      "Error retrieving task:",
      error
    );

    res.status(500).json({
      error: "Failed to retrieve task"
    });
  }
});
module.exports = router;