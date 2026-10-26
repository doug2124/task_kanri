const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand
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

module.exports = { saveTasksToDynamo };