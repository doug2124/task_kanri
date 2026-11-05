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

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});