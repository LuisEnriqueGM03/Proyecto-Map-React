module.exports = (sequelize, Sequelize) => {
    const SolicitudIncidente = sequelize.define("solicitud_incidente", {
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        fecha: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        estado: {
            type: Sequelize.ENUM,
            values: ["Pendiente", "Revisada", "Aprobada", "Rechazada"],
            allowNull: false,
            defaultValue: "Pendiente"
        }
    });

    return SolicitudIncidente;
};
