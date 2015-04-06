var express = require('express');
var Util = require(__dirname + '/server/lib/util');
var configs = require(__dirname + '/server/config.json');
//Used to turn string names into unique ids.
var md5 = require('crypto-js/md5');

var Logger = require(__dirname + '/server/lib/logger')(configs.log4js_srv);
var logger = Logger.getLogger('server');
logger.setLevel(configs.log4js_srv.default_level);

var ServiceNow = require('servicenow');
var servicenow_config = configs.servicenow_dev;
if (process.env.NODE_ENV && process.env.NODE_ENV == 'production') {
  logger.info("Loading Production ServiceNow configuration.");
  servicenow_config = configs.servicenow_prod;
} else {
  logger.info("Loading Dev ServiceNow configuration.");
  servicenow_config = configs.servicenow_dev;
}
var client = new ServiceNow.Client(servicenow_config);

var data = [];

var query = configs.servicenow_query.join("");
logger.info("Checking Query ["+query+"]");

var getRecordsFunction = function(err, result) {
  var event_obj, events = [];
  if (result && result.records.length > 0) {
    console.log("Read " + result.records.length + " records.");
    result.records.forEach(function(record) {
      event_obj = Util.parseMap2(configs.servicenow_map, {
                                          event: record
                                        });
      event_obj.md5 = md5(event_obj.name).toString();
      event_obj.coordinator_md5 = md5(event_obj.coordinator).toString();
      event_obj.implementer_md5 = md5(event_obj.implementer).toString();
      console.log(event_obj.name + "::MD5=" + event_obj.md5);
      events.push(event_obj);
    });
    data = events;
  }
};

client.getRecords("change_request", query, getRecordsFunction, true, true);
setInterval(function () {
  client.getRecords("change_request", query, getRecordsFunction, true, true);
}, 1000*60*3);  // 1000*60*3 = 3 minutes

var app = express();
app.use('/directives', express.static(__dirname + '/web/directives'));
app.use('/services', express.static(__dirname + '/web/services'));
app.use('/scripts', express.static(__dirname + '/web/scripts'));
app.use('/styles', express.static(__dirname + '/web/styles'));

app.get('/app.js', function(req, res) {
  res.sendFile(__dirname + '/web/app.js');
});
//app.get('/routes.js', function(req, res) {
//  res.sendFile(__dirname + '/web/routes.js');
//});
app.get('/api/v1/events', function(req, res) {
  res.json(data);
});
app.get('/api/v1/tooltiptemplate', function(req, res) {
  res.json(configs.tooltip_template);
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/web/index.html');
});
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/web/index.html');
});

app.listen(8080);
