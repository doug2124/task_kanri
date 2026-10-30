const express = require("express");
const cors = require("cors");
const path = require("path");
const generateRoute = require("./routes/tasks");
const saveRoute = require("./routes/tasks");
const deleteRoute =require("./routes/tasks");
const app = express();

app.use(cors());
app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "../frontend")
  )
);

app.use("/api", generateRoute);
app.use("/api",saveRoute);
app.use("/api",deleteRoute);

const server = app.listen(3000, () => {
  console.log("Server running");
});
console.log(server.address());