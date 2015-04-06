var log4js = require('log4js');
var fs = require('fs');

var Logger = function(logger_config) {
  var log_dir = logger_config.log_dir;
  try {
    fs.mkdirSync(log_dir, 511);
  } catch (e) {}
  log4js.configure(get_config(logger_config));
  return log4js;
};

Logger.getLogger = function(category) {
  if (category) {
    return log4js.getLogger(category);
  } else {
    return log4js.getLogger();
  }
};

var get_appender = function(template_name, category, appender_template){
  //console.log("Entering get_appender");
  var new_appender = {
    type: template_name,
    category: category
  };
  for (prop in appender_template) {
    new_appender[prop] = appender_template[prop];
  }
  //console.log("appender ["+new_appender+"]");
  return new_appender;
};

var get_config = function(logger_config) {
  var log4js_config = {};
  log4js_config.appenders = [];
  log4js_config.replaceConsole = logger_config.replaceConsole;
  var appenders = logger_config.appenders;
  //console.log("appenders ["+JSON.stringify(appenders, null, 2)+"]");
  var appender_templates = logger_config.appender_templates;
  for (var ia = 0, la = appenders.length, appender; ia < la; ia++) {
    appender = appenders[ia];
    //console.log("Creating appender ["+JSON.stringify(appender, null, 2)+"]");
    if (appender.category && appender.category === 'console') {
      log4js_config.appenders.push(appender);
    } else {
      for (var it = 0, lt = appender.templates.length, template; it < lt; it++) {
        template = appender.templates[it];
        //console.log("template ["+template+"]");
        log4js_config.appenders.push(
          get_appender(template, appender.category, appender_templates[template])
        );
      }
    }
  }
  return log4js_config;
};

module.exports = Logger;