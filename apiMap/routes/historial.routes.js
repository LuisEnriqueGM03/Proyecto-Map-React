module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/historial.controller.js");

    router.get('/', controller.listHistorial);
    router.get('/:id', controller.getHistorialById);
    router.post('/', controller.createHistorial);
    router.put('/:id', controller.updateHistorial);
    router.delete('/:id', controller.deleteHistorial);

    app.use('/historial', router);
};
