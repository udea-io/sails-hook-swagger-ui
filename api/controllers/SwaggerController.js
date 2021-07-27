const ejs = require('ejs');

module.exports = {
  ShowDoc: async function(req, res) {
    const {
      project,
    } = req.allParams();
    try {
      let swaggerObj = null;
      if (project && sails.hooks[project]) {
        swaggerObj = require(`${sails.config.appPath}/api/hooks/${project}/${sails.config['swagger-ui'].path}`);
      } else {
        swaggerObj = require(`${sails.config.appPath}/${sails.config['swagger-ui'].path}`);
      }

      ejs.renderFile(
        `${__dirname}/../../views/swagger-ui/index.ejs`,
        {
          data: swaggerObj,
          version: sails.config['swagger-ui'].version,
        },
        {},
        function(err, data) {
          if (err) throw err;
          return res.send(data);
        },
      );
    } catch (e) {
      return res.error(e);
    }
  }
}
