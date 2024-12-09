module.exports = (sequelize, Sequelize) => {
    const Carretera = sequelize.define("carretera", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        municipioOrigen: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        municipioDestino: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        estado: {
            type: Sequelize.ENUM,
            values: ["Bloqueada", "Libre"],
            allowNull: false
        },
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    });

    return Carretera;
};
