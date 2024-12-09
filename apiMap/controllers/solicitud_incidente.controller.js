const db = require("../models");
const SolicitudIncidente = db.SolicitudIncidente;
const fs = require('fs');

exports.listSolicitudesIncidente = async (req, res) => {
    try {
        const solicitudes = await SolicitudIncidente.findAll();
        res.json(solicitudes);
    } catch (error) {
        console.error("Error al listar las solicitudes de incidente:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getSolicitudIncidenteById = async (req, res) => {
    try {
        const solicitud = await SolicitudIncidente.findByPk(req.params.id);
        if (!solicitud) {
            return res.status(404).json({ msg: 'Solicitud de incidente no encontrada' });
        }
        res.json(solicitud);
    } catch (error) {
        console.error("Error al obtener la solicitud de incidente:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createSolicitudIncidente = async (req, res) => {
    try {
        const solicitud = await SolicitudIncidente.create(req.body);
        res.status(201).json(solicitud);
    } catch (error) {
        console.error("Error al crear la solicitud de incidente:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.updateSolicitudIncidente = async (req, res) => {
    try {
        const [updated] = await SolicitudIncidente.update(req.body, { where: { id: req.params.id } });
        if (!updated) {
            return res.status(404).json({ msg: 'Solicitud de incidente no encontrada' });
        }
        res.json({ msg: 'Solicitud de incidente actualizada exitosamente' });
    } catch (error) {
        console.error("Error al actualizar la solicitud de incidente:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSolicitudIncidente = async (req, res) => {
    try {
        const deleted = await SolicitudIncidente.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            return res.status(404).json({ msg: 'Solicitud de incidente no encontrada' });
        }
        res.json({ msg: 'Solicitud de incidente eliminada exitosamente' });
    } catch (error) {
        console.error("Error al eliminar la solicitud de incidente:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.uploadPicture = async (req, res) => {
    const id = req.params.id;
    try {
        const solicitud = await SolicitudIncidente.findByPk(id);
        if (!solicitud) {
            return res.status(404).json({ msg: 'Solicitud de incidente no encontrada' });
        }

        if (!req.files || !req.files.imagen) {
            return res.status(400).json({ msg: 'No se ha enviado el archivo' });
        }

        const file = req.files.imagen;
        const fileName = `${solicitud.id}.jpg`;

        file.mv(`public/solicitudes/${fileName}`, (err) => {
            if (err) {
                console.error("Error al mover el archivo:", err);
                return res.status(500).json({ msg: 'Error al subir la imagen' });
            }
            res.json(solicitud);
        });
    } catch (error) {
        console.error("Error en el controlador uploadPicture:", error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};
