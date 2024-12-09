const db = require("../models");
const Municipio = db.Municipio;

exports.listMunicipios = async (req, res) => {
    try {
        const municipios = await Municipio.findAll();
        res.json(municipios);
    } catch (error) {
        console.error("Error al listar los municipios:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getMunicipioById = async (req, res) => {
    try {
        const municipio = await Municipio.findByPk(req.params.id);
        if (!municipio) {
            return res.status(404).json({ msg: 'Municipio no encontrado' });
        }
        res.json(municipio);
    } catch (error) {
        console.error("Error al obtener el municipio:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createMunicipio = async (req, res) => {
    try {
        const municipio = await Municipio.create(req.body);
        res.status(201).json(municipio);
    } catch (error) {
        console.error("Error al crear el municipio:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.updateMunicipio = async (req, res) => {
    try {
        const [updated] = await Municipio.update(req.body, { where: { id: req.params.id } });
        if (!updated) {
            return res.status(404).json({ msg: 'Municipio no encontrado' });
        }
        res.json({ msg: 'Municipio actualizado exitosamente' });
    } catch (error) {
        console.error("Error al actualizar el municipio:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMunicipio = async (req, res) => {
    try {
        const deleted = await Municipio.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            return res.status(404).json({ msg: 'Municipio no encontrado' });
        }
        res.json({ msg: 'Municipio eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar el municipio:", error);
        res.status(500).json({ error: error.message });
    }
};
