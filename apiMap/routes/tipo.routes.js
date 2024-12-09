const controller = require("../controllers/pokemon.controller");
module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/tipo.controller.js");
    router.get('/', controller.listTipos);
    router.get('/:id', controller.getTipoById);
    router.post('/', controller.createTipo);
    router.put('/:id', controller.updateTipo);
    router.delete('/:id', controller.deleteTipo);
    router.post('/:id/imagen', controller.uploadPicture);
    app.use('/tipos', router);
};
