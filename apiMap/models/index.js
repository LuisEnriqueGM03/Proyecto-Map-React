const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Usuario = require("./usuario.model.js")(sequelize, Sequelize);
db.Municipio = require("./municipio.model.js")(sequelize, Sequelize);
db.Carretera = require("./carretera.model.js")(sequelize, Sequelize);
db.Puntos = require("./puntos.model.js")(sequelize, Sequelize);
db.Incidentes = require("./incidentes.model.js")(sequelize, Sequelize);
db.Tipo_Incidente = require("./tipo_incidente.model.js")(sequelize, Sequelize);
db.SolicitudIncidente = require("./solicitud_incidente.model.js")(sequelize, Sequelize);
db.Historial = require("./historial.model.js")(sequelize, Sequelize);

db.Carretera.belongsTo(db.Municipio, { as: "municipioOrigenData", foreignKey: "municipioOrigen" });
db.Carretera.belongsTo(db.Municipio, { as: "municipioDestinoData", foreignKey: "municipioDestino" });

db.Puntos.belongsTo(db.Carretera, { foreignKey: "carreteraId", as: "carretera", onDelete: "CASCADE" });
db.Carretera.hasMany(db.Puntos, { foreignKey: "carreteraId", as: "puntos", onDelete: "CASCADE" });

db.Incidentes.belongsTo(db.Carretera, { foreignKey: "carreteraId", as: "carretera" });
db.Incidentes.belongsTo(db.Tipo_Incidente, { foreignKey: "tipoIncidenteId", as: "tipoIncidente" });

db.Historial.belongsTo(db.Usuario, { foreignKey: "usuarioId", as: "usuario" });

module.exports = db;
