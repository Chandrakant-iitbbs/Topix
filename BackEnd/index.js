const connectToMongo = require("./db");
const express = require('express');
const app = express();
const cors = require('cors');
const startChatServer = require('./ChatServer/server');
require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;
const CHAT_PORT = process.env.CHAT_PORT ;
const BACKEND_PORT = process.env.BACKEND_PORT;

connectToMongo(DATABASE_URL);
startChatServer(CHAT_PORT);

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/ques", require("./routes/ques"));
app.use("/api/v1/answer", require("./routes/ans"));
app.use("/api/v1/tags", require("./routes/tags"));

app.listen(BACKEND_PORT, () => {
  console.log(`Topix backend listening on port ${BACKEND_PORT}`);
});