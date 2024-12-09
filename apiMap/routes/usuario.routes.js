module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/usuario.controller.js");

    router.get('/', controller.listUsuarios);
    router.get('/:id', controller.getUsuarioById);
    router.post('/', controller.createUsuario);
    router.put('/:id', controller.updateUsuario);
    router.delete('/:id', controller.deleteUsuario);
    router.post('/login', controller.login);
    router.post('/logout', controller.logout);
    router.put('/:id/cambiar-contrasena', controller.cambiarContrasena);


    app.use('/usuarios', router);
};
