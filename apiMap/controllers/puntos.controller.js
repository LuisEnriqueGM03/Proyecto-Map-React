const db = require("../models");
const Puntos = db.Puntos;

exports.listAllPuntos = async (req, res) => {
    try {
        const puntos = await Puntos.findAll({
            attributes: ["carreteraId", "polyline"], 
            order: [["carreteraId", "ASC"]]
        });
        res.json(puntos);
    } catch (error) {
        console.error("Error al listar todos los puntos:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.listPuntosByCarretera = async (req, res) => {
    try {
        const puntos = await Puntos.findOne({
            attributes: ["carreteraId", "polyline"], 
            where: { carreteraId: req.params.carreteraId }
        });
        if (!puntos) {
            return res.status(404).json({ message: "No se encontraron puntos para esta carretera." });
        }
        res.json(puntos);
    } catch (error) {
        console.error("Error al listar puntos por carretera:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createPunto = async (req, res) => {
    try {
        const punto = await Puntos.create(req.body);
        res.status(201).json(punto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updatePunto = async (req, res) => {
    try {
        const [updated] = await Puntos.update(req.body, { where: { id: req.params.id } });
        if (!updated) {
            return res.status(404).json({ msg: 'Punto no encontrado' });
        }
        res.json({ msg: 'Punto actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePunto = async (req, res) => {
    try {
        const deleted = await Puntos.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            return res.status(404).json({ msg: 'Punto no encontrado' });
        }
        res.json({ msg: 'Punto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

