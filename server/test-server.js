const express = require("express");
const app = express();

app.use(express.json());

app.post("/test", (req, res) => {
  console.log("Request body:", req.body);
  res.json({ status: "success", receivedData: req.body });
});

app.listen(5001, () => {
  console.log("Test server running on port 5001");
});