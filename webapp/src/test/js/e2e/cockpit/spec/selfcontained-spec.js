'use strict';

var fs = require('fs');
var path = require('path');
var CamSDK = require('camunda-bpm-sdk-js');


var resetUrl = 'http://localhost:8080/camunda/ensureCleanDb/default';
var request = require('request');

function deployed(err, deployment) {
  if(err) {
    throw err;
  }

  console.log(deployment);
}


request(resetUrl, function (err, res, body) {
  if (err) {
    throw err;
  }

  body = JSON.parse(body);
  console.info('res body', body.clean);

  var camClient = new CamSDK.Client({
    mock: false,
    apiUri: 'http://localhost:8080/engine-rest'
  });

  var deploymentService = new camClient.resource('deployment');
  var userService = new camClient.resource('user');

  deploymentService.create({
    deploymentName:           'failng-process',
    files:                    [{name: 'failing-process.bpmn',
      content: fs.readFileSync(__dirname + '/../../resources/failing-process.bpmn')}]
  }, deployed);
});
