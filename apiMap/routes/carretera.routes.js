module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/carretera.controller.js");

    router.get('/', controller.listCarreteras);
    router.get('/:id', controller.getCarreteraById);
    router.post('/', controller.createCarretera);
    router.put('/:id', controller.updateCarretera);
    router.delete('/:id', controller.deleteCarretera);

    app.use('/carreteras', router);
};
