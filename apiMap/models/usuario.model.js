module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        contraseña: {
            type: Sequelize.STRING,
            allowNull: false
        },
        tipo: {
            type: Sequelize.ENUM,
            values: ["Administrador", "Verificador"],
            allowNull: false
        }
    });

    return Usuario;
};
