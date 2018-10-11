export async function ShowDoc(req, res) {
  const {
    project,
  } = req.allParams();
  try {
    // console.log('project=>', project);
    // console.log('sails.hooks=>', sails.hooks);
    // console.log(`sails.hooks[${project}]=>`, sails.hooks[project]);
    let swaggerObj = null
    if (project && sails.hooks[project]) {
      swaggerObj = sails.hooks[project].swagger;
    } else {
      const defaultProject = sails.config['swagger-ui'].default;
      // console.log('defaultProject=>', defaultProject);
      if (defaultProject) {
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