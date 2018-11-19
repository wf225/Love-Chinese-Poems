let express = require('express');
let app = express();
let loader = require("./loader");

app.use(express.static('./'));

app.get('/index.htm', function (req, res) {
  res.sendFile(__dirname + "/" + "index.htm");
})

app.get('/get_topics/:num', function (req, res) {
  let num = req.params['num'];
  res.send(loader.getTopics(num));
})

let server = app.listen(8081, function () {
  let host = "localhost"; // server.address().address
  let port = server.address().port

  console.log("访问地址为 http://%s:%s", host, port)
});
