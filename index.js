import path from 'path';

module.exports = function (sails) {
    const loader = require('sails-util-micro-apps')(sails);
    return {
      configure() {
        loader.configure({
          policies: `${__dirname}/api/policies`, // Path to your hook's policies
          config: `${__dirname}/config`, // Path to your hook's config
          assets: `${__dirname}/assets`,
          views: `${__dirname}/views`,
        });
      },
      initialize(next) {
        loader.inject({
          responses: `${__dirname}/api/responses`,
          models: `${__dirname}/api/models`, // Path to your hook's models
          services: `${__dirname}/api/services`, // Path to your hook's services
          controllers: `${__dirname}/api/controllers`, // Path to your hook's controllers
        }, err => next(err));
      },
      customMiddleware(express, app, multipleViews, sails) {
        try {
          const maxAge = sails.config.http.cache;
          app.use('/assets', express.static(`${__dirname}/assets`, { maxAge }));
          multipleViews(app, path.join(__dirname, 'views'));
        } catch (e) {
          sails.log.error('run hook customMiddleware error', e);
          throw e;
        }
      },
    };
};
