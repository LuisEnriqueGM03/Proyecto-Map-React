module.exports = (sequelize, Sequelize) => {
    const Tipo_Incidente = sequelize.define("tipo_incidente", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    });

    return Tipo_Incidente;
};
