module.exports = async function ShowDoc(req, res) {
  const {
    project,
  } = req.allParams();
  try {
    let swaggerObj = null
    if (project && sails.hooks[project]) {
      swaggerObj = sails.hooks[project].swagger;
    } else {
      const defaultProject = sails.config['swagger-ui'].default;
      if (defaultProject && sails.hooks[defaultProject]) {
        swaggerObj = sails.hooks[defaultProject].swagger;
      }
    }
    return res.view('swagger-ui/index', {
      data: swaggerObj,
      message: 'success',
      layout: false,
    }); 
  } catch (e) {
    return res.error(e);
  }
}
