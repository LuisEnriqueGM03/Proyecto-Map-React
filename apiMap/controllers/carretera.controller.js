const db = require("../models");
const Carretera = db.Carretera;
const Municipio = db.Municipio;

exports.listCarreteras = async (req, res) => {
    try {
        const carreteras = await Carretera.findAll({
            attributes: ["id", "nombre", "municipioOrigen", "municipioDestino", "estado", "descripcion"] // Seleccionamos solo las columnas necesarias
        });
        res.status(200).json(carreteras);
    } catch (error) {
        console.error("Error al obtener las carreteras:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCarreteraById = async (req, res) => {
    try {
        const carretera = await Carretera.findByPk(req.params.id, {
            attributes: ["id", "nombre", "municipioOrigen", "municipioDestino", "estado", "descripcion"]
        });
        if (!carretera) {
            return res.status(404).json({ msg: 'Carretera no encontrada' });
        }
        res.json(carretera);
    } catch (error) {
        console.error("Error al obtener la carretera:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createCarretera = async (req, res) => {
    try {
        const carretera = await Carretera.create(req.body);
        res.status(201).json(carretera);
    } catch (error) {
        console.error("Error al crear la carretera:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.updateCarretera = async (req, res) => {
    try {
        const [updated] = await Carretera.update(req.body, { where: { id: req.params.id } });
        if (!updated) {
            return res.status(404).json({ msg: 'Carretera no encontrada' });
        }
        res.json({ msg: 'Carretera actualizada exitosamente' });
    } catch (error) {
        console.error("Error al actualizar la carretera:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCarretera = async (req, res) => {
    try {
        const id = req.params.id;
        const carretera = await Carretera.findByPk(id);
        if (!carretera) {
            return res.status(404).json({ msg: 'Carretera no encontrada' });
        }
        const deleted = await Carretera.destroy({ where: { id } });
        if (!deleted) {
            return res.status(404).json({ msg: 'Error al eliminar la carretera' });
        }
        
        res.json({ msg: 'Carretera y puntos asociados eliminados exitosamente' });
    } catch (error) {
        console.error("Error al eliminar la carretera:", error);
        res.status(500).json({ error: error.message });
    }
};
