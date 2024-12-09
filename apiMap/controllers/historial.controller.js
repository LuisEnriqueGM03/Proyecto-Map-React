const db = require("../models");
const Historial = db.Historial;
const Usuario = db.Usuario;

exports.listHistorial = async (req, res) => {
    try {
        const historial = await Historial.findAll({
            include: [{ model: Usuario, as: 'usuario' }],
            order: [['fecha', 'DESC']]
        });
        res.json(historial);
    } catch (error) {
        console.error("Error al listar el historial:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getHistorialById = async (req, res) => {
    try {
        const historial = await Historial.findByPk(req.params.id, {
            include: [{ model: Usuario, as: 'usuario' }]
        });
        if (!historial) {
            return res.status(404).json({ msg: 'Registro de historial no encontrado' });
        }
        res.json(historial);
    } catch (error) {
        console.error("Error al obtener el historial:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createHistorial = async (req, res) => {
    try {
        const historial = await Historial.create(req.body);
        res.status(201).json(historial);
    } catch (error) {
        console.error("Error al crear el historial:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.updateHistorial = async (req, res) => {
    try {
        const [updated] = await Historial.update(req.body, { where: { id: req.params.id } });
        if (!updated) {
            return res.status(404).json({ msg: 'Registro de historial no encontrado' });
        }
        res.json({ msg: 'Registro de historial actualizado exitosamente' });
    } catch (error) {
        console.error("Error al actualizar el historial:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHistorial = async (req, res) => {
    try {
        const deleted = await Historial.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            return res.status(404).json({ msg: 'Registro de historial no encontrado' });
        }
        res.json({ msg: 'Registro de historial eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar el historial:", error);
        res.status(500).json({ error: error.message });
    }
};
