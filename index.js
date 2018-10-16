var path = require('path');

module.exports = function (sails) {
  var hookName = 'swagger-ui';
  var loader = require('sails-util-micro-apps')(sails);
  var hookConfig = require(`./config/${hookName}`);
  var config = sails.config[hookName] || hookConfig[hookName];
  var isEnable = config.enable;
  return {
    config,
    configure() {
      if (isEnable) {
        loader.configure({
          policies: `${__dirname}/api/policies`,
          config: `${__dirname}/config`,
          assets: `${__dirname}/assets`,
          views: `${__dirname}/views`,
        });
      }
    },
    initialize(next) {
      sails.log.debug(`[!][sails-hook-${hookName}] Enable Status: ${isEnable}`);
      if (isEnable) {
        loader.inject({
          models: `${__dirname}/api/models`,
          helpers: `${__dirname}/api/helpers`,
          services: `${__dirname}/api/services`,
          responses: `${__dirname}/api/responses`,
          controllers: `${__dirname}/api/controllers`,
        }, err => next(err));
      } else next();
    },
    customMiddleware(express, app, multipleViews, sails) {
      try {
        if (isEnable) {
          var maxAge = sails.config.http.cache;
          app.use('/assets', express.static(`${__dirname}/assets`, {
            maxAge
          }));
          multipleViews(app, path.join(__dirname, 'views'));
        }
      } catch (e) {
        sails.log.error('run hook customMiddleware error', e);
        throw e;
      }
    },
  };
};