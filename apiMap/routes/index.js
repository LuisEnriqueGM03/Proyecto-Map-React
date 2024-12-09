module.exports = (app) => {
    require('./usuario.routes')(app);
    require('./municipio.routes')(app);
    require('./carretera.routes')(app);
    require('./puntos.routes')(app);
    require('./incidentes.routes')(app);
    require('./tipo_incidente.routes')(app);
    require('./solicitud_incidente.routes')(app);
    require('./historial.routes')(app);
};
