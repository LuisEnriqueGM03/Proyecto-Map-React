module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/incidentes.controller.js");

    router.get('/', controller.listIncidentes);
    router.get('/:id', controller.getIncidenteById);
    router.post('/', controller.createIncidente);
    router.put('/:id', controller.updateIncidente);
    router.delete('/:id', controller.deleteIncidente);
    router.post('/:id/imagen', controller.uploadPicture);
    router.get("/carretera/:carreteraId", controller.obtenerIncidentesPorCarretera);
    router.get("/tipo/:tipoIncidenteId", controller.obtenerIncidentesPorTipo);

    app.use('/incidentes', router);
};
