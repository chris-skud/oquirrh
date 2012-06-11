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

/* get readme.html static file */
app.get('/readme', function(req,res) {
  console.log('Readme requested');
  // at some point may want to pass initial data down with template vs. ajax call
  res.sendfile('public/readme.html');
});

/* get index.html static file */
app.get('/', function(req,res) {
  console.log('Index html requested');
  // at some point may want to pass initial data down with template vs. ajax call
  res.sendfile('public/index.html');
});

/* get all deploy records */
app.get('/api/deploys', function (req, res) {
  console.log('Get all deploys operation requested');
  deploymodel.getAll(function(err, deploys) {
    if(err) {
      console.log('error ' + err);
      throw err;
    }
    else {
      res.json(deploys);
    }
  });
});

/* Edit deploy record.  express put was not working... */
app.put('/api/deploys/:id', function (req, res) {
  console.log('Edit deploy operation requested with data: id = ' + req.params.id + 'body = ' + JSON.stringify(req.body));
  deploymodel.editById(req.params.id, req.body, function(err, deploy)
  {
    if(err) {
      console.log('error ' + err);
      throw err;
    }
    else {
      res.json(deploy);
    }
  });
});

/* Create new deploy record */
app.post('/api/deploys', function (req, res) {
  console.log('Create deploy operation requested with data = ' + JSON.stringify(req.body));
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


/* Get by id */
app.get('/api/deploys/:id', function (req, res) {
  console.log('Get operation requested on id: ' + req.params.id);
  deploymodel.getById(req.params.id, function(err, deploy) {
    if(err) {
      console.log('error ' + err);
      throw err;
    }
    else {
      if (deploy === null) {
        res.send('', 404)
      }
      else {
        res.json(deploy);
      }
    }
  });
});



/* delete by id */
app.delete('/api/deploys/:id', function (req, res) {
  console.log('Delete operation requested on id: ' + req.params.id);
  deploymodel.deleteById(req.params.id, function(err, deploy) {
    if(err) {
      console.log('error ' + err);
      throw err;
    }
    else {
      if (deploy === null) {
        res.send('', 404)
      }
      else {
        res.json(deploy);
      }
    }
  });
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