var express = require('express');
var app = express();

var mongoose = require('mongoose');

mongoose.connect('localhost', 'test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

// User Schema
var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  number: { type: String, required: true},
  name: {type: String, required: true}
});
  
var User  = mongoose.model('User', userSchema);

app.configure(function () {
  app.use(allowCrossDomain);
  app.use(express.bodyParser());
 });


app.get('/contacts', listContacts);
app.post('/contacts', createContact);
// app.put('http://localhost:9090/:id', updateContact);
// app.delete('http://localhost:9090/:id', deleteContact);

function listContacts(req, res) {
  var options = {};
  if (req.query.skip) {
    options.skip = req.query.skip;
  }
  if (req.query.limit) {
    options.limit = req.query.limit;
  }
  User.find(null, null, options, function (err, docs) {
    if (err) {
      console.log(err);
      res.send(500, err);
    } else {
      res.send(200, docs);
    }
  });
}

function createContact(req, res) {
  User.create(req.body, function (err, doc) {
    if (err) {
      console.log(err);
      res.send(500, err);
    } else {
      res.send(200, doc);
    }
  });
}

app.listen(9090, function() {
  console.log('Express server listening on port 9090');
});

