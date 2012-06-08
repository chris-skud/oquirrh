mongoose = require('mongoose');
config = require('./config/config.js');

mongoose.connect(config.mongoconnection);

var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

// Define the DeployMessage schema
DeployMessageSchema = new Schema({
  'platform_name': String,
  'release_name': String,
  'event_name': String,
  'comment': String,
  'timestamp': { type: Date, default: Date.now }
});

// 'DeployMessage' is the name of the mongo collection
var DeployMessage = mongoose.model('DeployMessage', DeployMessageSchema);

// get all deploy records
exports.alldeploys = function(callback) {
  DeployMessage.find({ /* mongo selectors go here */ } , callback);
}

exports.add = function(deploy, callback) {
  // create a new instance of DeployMessage.  Does MOngoose have a cast method?
  var newDeployMessage = new DeployMessage({
    platform_name: deploy.platform_name,
    release_name: deploy.release_name,
    event_name: deploy.event_name,
    comment: deploy.comment,
    timestamp: deploy.timestamp
  });

  newDeployMessage.save(function(err){
    // saving is asynchronous
    if(err) console.log("Something went wrong while saving the thing");
    else console.log("DeployMessage was successfully saved");
  });
};