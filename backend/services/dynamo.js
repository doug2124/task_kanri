const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const secrets = require("../secrets");

const client = new DynamoDBClient({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: secrets.AWS_ACCESS_KEY_ID,
    secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY,
    sessionToken: secrets.AWS_SESSION_TOKEN,
  },
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
module.exports = { saveTasksToDynamo, getTasksFromDynamo, getTaskByGoalId };