var application_root = __dirname,
  express = require("express"),
  path = require("path"),
  deploymodel = require("./lib/deploymodel.js");
    
var app = express.createServer();

// Config
app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "/public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  // disable layout
});

app.get('/readme', function(req,res) {
  // at some point may want to pass initial data down with template vs. ajax call
  res.sendfile('public/readme.html');
});

app.get('/', function(req,res) {
  // at some point may want to pass initial data down with template vs. ajax call
  res.sendfile('public/index.html');
});

/* prolly need filter params on this one */
app.get('/api/deploys', function (req, res) {
  deploymodel.alldeploys(function(err, deploys) {
    if(err) {
      console.log('error ' + err);
      throw err;
    }
    else {
      res.json(deploys);
    }
  });
});



app.post('/api/deploys', function (req, res) {
  console.log(req.body.release_name);
  deploymodel.add(req.body, function(err, newid)
  {
    if(err) {
      console.log('error ' + err);
      throw err;
    }
    else {
      res.json(newid);
    }
  });

});

app.get('/api/deploys/:id', function (req, res) {
  deploymodel.getbyid()
  res.json(deploymodel.getbyid(id));
});

app.post('/api/meaninterval', function (req, res) { 
  //res.json(maths.meaninterval(req.postdata.deploy.timestamps))
});

app.post('/api/cycletime', function (req, res) { 
  //res.json(maths.cycletime(req.postdata.deploy.timestamps))
});

app.post('/api/overhead', function (req, res) { 
  //res.json(maths.overhead(req.postdata.deploy.timestamps))
});

// Launch server
app.listen(4242);