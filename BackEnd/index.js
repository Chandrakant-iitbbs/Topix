const connectToMongo = require("./db");
const express = require('express');
const app = express();
const cors = require('cors');

const port = 5000
connectToMongo();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/ques", require("./routes/ques"));
app.use("/api/v1/answer", require("./routes/ans"));
app.use("/api/v1/tags", require("./routes/tags"));

app.listen(port, () => {
  console.log(`topix backend listening on port ${port}`);
});