module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/solicitud_incidente.controller.js");

    router.get('/', controller.listSolicitudesIncidente);
    router.get('/:id', controller.getSolicitudIncidenteById);
    router.post('/', controller.createSolicitudIncidente);
    router.put('/:id', controller.updateSolicitudIncidente);
    router.delete('/:id', controller.deleteSolicitudIncidente);
    router.post('/:id/imagen', controller.uploadPicture);

    app.use('/solicitudes_incidente', router);
};
