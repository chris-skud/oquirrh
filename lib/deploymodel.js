mongoose = require('mongoose');
config = require('../config/config.js');

mongoose.connect(config.mongoconnection);
var Schema = mongoose.Schema;

// Define the Deploy schema
DeploySchema = new Schema({
  'release_name': String,
  'tags': String,
  'comment': String,
  'timestamp': { type: Date, default: Date.now }
});

// 'deploys' is the name of the mongo collection
var Deploy = mongoose.model('deploys', DeploySchema);

/* get all deploy records */
exports.getAll = function(callback) {
  //Deploy.find({ /* mongo selectors go here */ } , callback);
  var query = Deploy.find({});
  query.sort('timestamp', -1);
  query.exec(callback);

}

/* add a deploy record */
exports.add = function(deploy, callback) {
  var newDeploy = new Deploy({
    // should really add some validations
    release_name: deploy.release_name,
    tags: deploy.tags,
    comment: deploy.comment,
    timestamp: (deploy.timestamp) ? deploy.timestamp : Date.Now
  });

  newDeploy.save(function(err) {
    callback(err, newDeploy._id);
  });
};

/* get deploy record by id */
exports.getById = function(deployId, callback) {
  Deploy.findOne({ '_id': deployId } , callback);
}

/* edit deploy record by id */
exports.editById = function(deployId, updatedDeploy, callback) {
  Deploy.findOne({ '_id': deployId } , function(err, deploy) {
    
    // validate whether the fields have values (need more type specific checking.  Prolly need this for add as well so 
    // should push it to a function.
    if (typeof updatedDeploy.release_name !== "undefined") {
      deploy.release_name = updatedDeploy.release_name;
    }
    if (typeof updatedDeploy.tags !== "undefined") {
      deploy.tags = updatedDeploy.tags;
    }
    if (typeof updatedDeploy.comment !== "undefined") {
      deploy.comment = updatedDeploy.comment;
    }
    if (typeof updatedDeploy.timestamp !== "undefined") {
      deploy.timestamp = updatedDeploy.timestamp;
    }

    deploy.save(function(err) {
      callback(err, deploy);
    });
  });
}

/* delete deploy record by id */
exports.deleteById = function(deployId, callback) {
  Deploy.findOne({ '_id': deployId } , function(err, deploy) {
    if (err) {
      console.log(err);
      throw err;
    }
    else {
      // just avoid the db call if we konw there's no record
      if (deploy === null) {
        console.log('Delete was requested for item that does not exist');
        callback(err, null);
      }
      else {
        console.log('Deploy.remove with id: ' + deployId + ' being requested');
        Deploy.remove({ '_id': deployId } , function(err) {
          callback(err, deploy);
        });  
      }
    }
  });
}
