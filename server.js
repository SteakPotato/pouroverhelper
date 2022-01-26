
const express = require('express')
const app = express()
const port = 3000

//public dir
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('index.html')
})

//port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

