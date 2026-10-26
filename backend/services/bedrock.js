const {
    BedrockRuntimeClient,
    InvokeModelCommand
  } = require("@aws-sdk/client-bedrock-runtime");
  
  //const secrets = require("../secrets");
  const client =
  new BedrockRuntimeClient({
    region: "ap-northeast-1",
    //credentials: {
    //accessKeyId: secrets.AWS_ACCESS_KEY_ID,
    //secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY,
    //sessionToken: secrets.AWS_SESSION_TOKEN,
  //},
  });
  
  async function generateTasks(goal) {
  
    const prompt = `
  目的を達成するためのタスクを、箇条書きでいくつにしてもよいけれど、最大で10個までに収める
  
  ${goal}
  何も説明しない
  markdownは禁止
  \`\`\`.は禁止
  JSON形式で出力してください。:
  
  {
    "tasks":[
      "task 1",
      "task 2"
    ]
  }
  `;
  
    const command =
    new InvokeModelCommand({
  
      modelId:
      "apac.amazon.nova-micro-v1:0",
  
      contentType:
      "application/json",
  
      accept:
      "application/json",
  
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });
  
    const response =
      await client.send(command);
  
    const body =
      JSON.parse(
        new TextDecoder()
        .decode(response.body)
      );
  
    return JSON.parse(
      body.output.message.content[0].text
    );
  }
  
  module.exports = generateTasks;