module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/puntos.controller.js");

    router.get('/', controller.listAllPuntos);
    router.get('/:carreteraId', controller.listPuntosByCarretera);
    router.post('/', controller.createPunto);
    router.put('/:id', controller.updatePunto);
    router.delete('/:id', controller.deletePunto);


    app.use('/puntos', router);
};
