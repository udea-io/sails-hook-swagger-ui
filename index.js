var path = require('path');

module.exports = function (sails) {
  var loader = require('sails-util-micro-apps')(sails);
  return {
    defaults: {
      __configKey__: {
        enable: true,
        exposeToGlobal: true,
        _hookTimeout: 10 * 1000,
        default: null,
      },
    },
    configure() {
      loader.configure({
        policies: `${__dirname}/api/policies`,
        config: `${__dirname}/config`,
        assets: `${__dirname}/assets`,
        views: `${__dirname}/views`,
      });
    },
    initialize(next) {
      loader.inject({
        models: `${__dirname}/api/models`,
        helpers: `${__dirname}/api/helpers`,
        services: `${__dirname}/api/services`,
        responses: `${__dirname}/api/responses`,
        controllers: `${__dirname}/api/controllers`,
      }, err => next(err));
    },
    customMiddleware(express, app, multipleViews, sails) {
      try {
        var maxAge = sails.config.http.cache;
        app.use('/assets', express.static(`${__dirname}/assets`, {
          maxAge
        }));
        multipleViews(app, path.join(__dirname, 'views'));
      } catch (e) {
        sails.log.error('run hook customMiddleware error', e);
        throw e;
      }
    },
  };
};