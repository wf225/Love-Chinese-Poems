let express = require('express');
let app = express();
let server = require('http').createServer(app);

// app.set('port', process.env.PORT || 8081);
app.use(express.static('./')); // set the static files location /public/img will be /img for users

// routes
require('./routes.js')(app);

// listen (start app with node server.js)
let host = "192.168.1.8"; // "localhost";
const port = "8081";
// app.listen(port);
// console.log("Server listening on port " + port);
server.listen(port, host, function () {
  console.log('Server listening on port ' + port);
});
