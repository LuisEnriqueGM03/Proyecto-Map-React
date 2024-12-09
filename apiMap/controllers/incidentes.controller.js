const db = require("../models");
const Incidentes = db.Incidentes;
const Carretera = db.Carretera;
const Tipo_Incidente = db.Tipo_Incidente;

exports.listIncidentes = async (req, res) => {
    try {
        const incidentes = await Incidentes.findAll({
            include: [
                { model: Carretera, as: 'carretera' },
                { model: Tipo_Incidente, as: 'tipoIncidente' }
            ]
        });
        res.json(incidentes);
    } catch (error) {
        console.error("Error al listar los incidentes:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getIncidenteById = async (req, res) => {
    try {
        const incidente = await Incidentes.findByPk(req.params.id, {
            include: [
                { model: Carretera, as: 'carretera' },
                { model: Tipo_Incidente, as: 'tipoIncidente' }
            ]
        });
        if (!incidente) {
            return res.status(404).json({ msg: 'Incidente no encontrado' });
        }
        res.json(incidente);
    } catch (error) {
        console.error("Error al obtener el incidente:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createIncidente = async (req, res) => {
    try {
        const incidente = await Incidentes.create(req.body);
        res.status(201).json(incidente);
    } catch (error) {
        console.error("Error al crear el incidente:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.updateIncidente = async (req, res) => {
    try {
        const [updated] = await Incidentes.update(req.body, { where: { id: req.params.id } });
        if (!updated) {
            return res.status(404).json({ msg: 'Incidente no encontrado' });
        }
        res.json({ msg: 'Incidente actualizado exitosamente' });
    } catch (error) {
        console.error("Error al actualizar el incidente:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteIncidente = async (req, res) => {
    try {
        const deleted = await Incidentes.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            return res.status(404).json({ msg: 'Incidente no encontrado' });
        }
        res.json({ msg: 'Incidente eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar el incidente:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.uploadPicture = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await Incidentes.findByPk(id);
        if (!incidente) {
            return res.status(404).json({ msg: 'Incidente no encontrado' });
        }

        if (!req.files || !req.files.imagen) {
            return res.status(400).json({ msg: 'No se ha enviado el archivo' });
        }

        const file = req.files.imagen;
        const fileName = `${incidente.id}.jpg`;

        file.mv(`public/incidentes/${fileName}`, (err) => {
            if (err) {
                console.error("Error al mover el archivo:", err);
                return res.status(500).json({ msg: 'Error al subir la imagen' });
            }
            res.json(incidente);
        });
    } catch (error) {
        console.error("Error en el controlador uploadPicture:", error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.obtenerIncidentesPorCarretera = async (req, res) => {
    try {
        const incidentes = await db.Incidentes.findAll({
            where: { carreteraId: req.params.carreteraId },
            include: [
                { model: db.Carretera, as: "carretera" },
                { model: db.Tipo_Incidente, as: "tipoIncidente" },
            ],
        });
        res.json(incidentes);
    } catch (error) {
        console.error("Error al obtener incidentes por carreteraId:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerIncidentesPorTipo = async (req, res) => {
    try {
        const incidentes = await db.Incidentes.findAll({
            where: { tipoIncidenteId: req.params.tipoIncidenteId },
            include: [
                { model: db.Carretera, as: "carretera" },
                { model: db.Tipo_Incidente, as: "tipoIncidente" },
            ],
        });
        res.json(incidentes);
    } catch (error) {
        console.error("Error al obtener incidentes por tipoIncidenteId:", error);
        res.status(500).json({ error: error.message });
    }
};
