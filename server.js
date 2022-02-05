
const express = require('express')
const path = require("path");
const app = express()
const port = 3000

//public dir
app.use('/', express.static(path.join(__dirname + '/public')));
app.use('/about', express.static(path.join(__dirname + '/public/index.html')));

app.get('/', (req, res) => {
  res.send('index.html')
})

//port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

