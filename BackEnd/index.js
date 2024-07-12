const express = require('express')
const app = express()

const port = 5000

app.get('/', (req, res) => {
    res.send('Hi from the backend');
});

app.listen(port, () => {
  console.log(`topix backend listening on port ${port}`);
});