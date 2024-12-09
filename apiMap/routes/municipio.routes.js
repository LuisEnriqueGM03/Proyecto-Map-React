module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/municipio.controller.js");

    router.get('/', controller.listMunicipios);
    router.get('/:id', controller.getMunicipioById);
    router.post('/', controller.createMunicipio);
    router.put('/:id', controller.updateMunicipio);
    router.delete('/:id', controller.deleteMunicipio);

    app.use('/municipios', router);
};
