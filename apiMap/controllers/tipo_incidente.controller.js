const db = require("../models");
const Tipo_Incidente = db.Tipo_Incidente;

exports.listTiposIncidente = async (req, res) => {
    try {
        const tipos = await Tipo_Incidente.findAll();
        res.json(tipos);
    } catch (error) {
        console.error("Error al listar los tipos de incidente:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getTipoIncidenteById = async (req, res) => {
    try {
        const tipo = await Tipo_Incidente.findByPk(req.params.id);
        if (!tipo) {
            return res.status(404).json({ msg: 'Tipo de incidente no encontrado' });
        }
        res.json(tipo);
    } catch (error) {
        console.error("Error al obtener el tipo de incidente:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createTipoIncidente = async (req, res) => {
    try {
        const tipo = await Tipo_Incidente.create(req.body);
        res.status(201).json(tipo);
    } catch (error) {
        console.error("Error al crear el tipo de incidente:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.updateTipoIncidente = async (req, res) => {
    try {
        const [updated] = await Tipo_Incidente.update(req.body, { where: { id: req.params.id } });
        if (!updated) {
            return res.status(404).json({ msg: 'Tipo de incidente no encontrado' });
        }
        res.json({ msg: 'Tipo de incidente actualizado exitosamente' });
    } catch (error) {
        console.error("Error al actualizar el tipo de incidente:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTipoIncidente = async (req, res) => {
    try {
        const deleted = await Tipo_Incidente.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            return res.status(404).json({ msg: 'Tipo de incidente no encontrado' });
        }
        res.json({ msg: 'Tipo de incidente eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar el tipo de incidente:", error);
        res.status(500).json({ error: error.message });
    }
};
