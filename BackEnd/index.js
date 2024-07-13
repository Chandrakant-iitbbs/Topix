const connectToMongo = require("./db");
const express = require('express');
const app = express();
const cors = require('cors');

const port = 5000
connectToMongo();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hi from the backend');
});

app.use("/api/v1/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`topix backend listening on port ${port}`);
});