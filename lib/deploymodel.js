mongoose = require('mongoose');
config = require('../config/config.js');

mongoose.connect(config.mongoconnection);

var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

// Define the Deploy schema
DeploySchema = new Schema({
  'release_name': String,
  'tags': String,
  'comment': String,
  'timestamp': { type: Date, default: Date.now }
});

// 'deploys' is the name of the mongo collection
var Deploy = mongoose.model('deploys', DeploySchema);

// get all deploy records
exports.alldeploys = function(callback) {
  //Deploy.find({ /* mongo selectors go here */ } , callback);
  var query = Deploy.find({});
  query.sort('timestamp', -1);
  query.exec(callback);

}

// add a deploy record
exports.add = function(deploy, callback) {
  var newDeploy = new Deploy({
    release_name: deploy.release_name,
    tags: deploy.tags,
    comment: deploy.comment,
    timestamp: (deploy.timestamp) ? deploy.timestamp : Date.Now
  });
    //TODO: timetamp needs to accept user input.

  newDeploy.save(function(err) {
    callback(err, newDeploy._id);
  });
};

