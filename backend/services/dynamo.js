const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "ap-northeast-1",
});

const dynamo = DynamoDBDocumentClient.from(client);

async function saveTasksToDynamo(goal, tasks) {
  const result = await dynamo.send(
    new PutCommand({
      TableName: "Tasks",
      Item: {
        userId:"user123",
        goalId: Date.now().toString(),
        taskId: Date.now().toString(),
        goal,
        tasks,
        createdAt: new Date().toISOString(),
      },
    })
  );
  console.log(result);
  return { success: true };
}

async function getTasksFromDynamo() {
  const result = await dynamo.send(
    new ScanCommand({
      TableName: "Tasks",
    })
  );
  console.log(result);
  return result.Items;
}
async function getTaskByGoalId(userId, goalId) {
  const result = await dynamo.send(
    new GetCommand({
      TableName: "Tasks",
      Key: {
        userId,
        goalId
      }
    })
  );
  console.log(result);
  return result.Item;
}
async function deleteGoal(goalId){
console.log("deleting goal id:",goalId);
try{
const result =await dynamo.send(
  new DeleteCommand({
    TableName:"Tasks",
    Key:{
      userId:"user123",
      goalId:goalId
    }
  })
)}catch(error){
  console.error("DELETE ERROR:",error);
  res.status(500).json({
    error:error.message
  })
};
}
async function updateTask(goalId, tasks) {
  const TABLE_NAME = "Tasks";
  await dynamo.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        userId: userId,
        goalId: goalId
      },
      UpdateExpression: "SET tasks = :tasks",
      ExpressionAttributeValues: {
        ":tasks": tasks
      }
    })
  );
}
module.exports = { saveTasksToDynamo, getTasksFromDynamo, getTaskByGoalId,deleteGoal, updateTask};