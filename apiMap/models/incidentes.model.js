module.exports = (sequelize, Sequelize) => {
    const Incidentes = sequelize.define("incidentes", {
        carreteraId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        tipoIncidenteId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        lat: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        long: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    });

    return Incidentes;
};
