module.exports = (sequelize, Sequelize) => {
    const Puntos = sequelize.define("puntos", {
        carreteraId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        polyline: {
            type: Sequelize.JSON, 
            allowNull: false 
        }
    });

    return Puntos;
};
