let loader = require("./loader");

module.exports = function (app) {

  // RESTful api example
  /*
  // get all todos
  app.get('/api/todos', function (req, res) {
      // use mongoose to get all todos in the database
      getTodos(res);
  });

  // create todo and send back all todos after creation
  app.post('/api/todos', function (req, res) {
      // create a todo, information comes from AJAX request from Angular
      Todo.create({
          text: req.body.text,
          done: false
      }, function (err, todo) {
          if (err)
              res.send(err);

          // get and return all the todos after you create another
          getTodos(res);
      });

  });

  // delete a todo
  app.delete('/api/todos/:todo_id', function (req, res) {
      Todo.remove({
          _id: req.params.todo_id
      }, function (err, todo) {
          if (err)
              res.send(err);

          getTodos(res);
      });
  });   
*/

  app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
  })

  app.get('/get_topics/:num', function (req, res) {
    let num = req.params['num'];
    res.send(loader.getTopics(num));
  })

};