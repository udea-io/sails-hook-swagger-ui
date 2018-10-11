var path = require('path');
var config = require('./config/swagger-ui');

module.exports = function (sails) {
    const loader = require('sails-util-micro-apps')(sails);
    const config = sails.config['swagger-ui'] || config;
    const isEnable = config.enable;
    return {
      configure() {
        if (isEnable) {
          loader.configure({
            policies: `${__dirname}/api/policies`, // Path to your hook's policies
            config: `${__dirname}/config`, // Path to your hook's config
            assets: `${__dirname}/assets`,
            views: `${__dirname}/views`,
          });
        }
      },
      initialize(next) {
        if (isEnable) {
          loader.inject({
            responses: `${__dirname}/api/responses`,
            models: `${__dirname}/api/models`, // Path to your hook's models
            services: `${__dirname}/api/services`, // Path to your hook's services
            controllers: `${__dirname}/api/controllers`, // Path to your hook's controllers
          }, err => next(err));
        }
      },
      customMiddleware(express, app, multipleViews, sails) {
        try {
          if (isEnable) {
            const maxAge = sails.config.http.cache;
            app.use('/assets', express.static(`${__dirname}/assets`, { maxAge }));
            multipleViews(app, path.join(__dirname, 'views'));
          }
        } catch (e) {
          sails.log.error('run hook customMiddleware error', e);
          throw e;
        }
      },
    };
};
