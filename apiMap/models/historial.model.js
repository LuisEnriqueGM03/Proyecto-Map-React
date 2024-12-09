module.exports = (sequelize, Sequelize) => {
    const Historial = sequelize.define("historial", {
        usuarioId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        accion: {
            type: Sequelize.ENUM,
            values: ["Crear", "Editar", "Eliminar"],
            allowNull: false
        },
        fecha: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        entidad: {
            type: Sequelize.STRING,
            allowNull: false
        },
        entidadId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return Historial;
};
