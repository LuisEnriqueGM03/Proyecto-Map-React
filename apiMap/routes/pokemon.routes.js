module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/pokemon.controller.js");

    router.get('/', controller.listPokemons);
    router.get('/:id', controller.getPokemonById);
    router.post('/', controller.createPokemon);
    router.put('/:id', controller.updatePokemon);
    router.patch('/:id', controller.partialUpdatePokemon);
    router.delete('/:id', controller.deletePokemon);
    router.post('/:id/imagen', controller.uploadPicture);
    app.use('/pokemons', router);
};
