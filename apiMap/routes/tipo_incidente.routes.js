
module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/tipo_incidente.controller.js");

    router.get('/', controller.listTiposIncidente);
    router.get('/:id', controller.getTipoIncidenteById);
    router.post('/', controller.createTipoIncidente);
    router.put('/:id', controller.updateTipoIncidente);
    router.delete('/:id', controller.deleteTipoIncidente);

    app.use('/tipos_incidente', router);
};
