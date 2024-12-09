module.exports = (sequelize, Sequelize) => {
    const Municipio = sequelize.define("municipio", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        lat: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        long: {
            type: Sequelize.FLOAT,
            allowNull: false
        }
    });

    return Municipio;
};
