const db = require("../models");
const Usuario = db.Usuario;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

exports.listUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.error("Error al listar los usuarios:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createUsuario = async (req, res) => {
    try {
        const { nombre, email, contraseña, tipo } = req.body;
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const usuario = await Usuario.create({ 
            nombre, 
            email, 
            contraseña: hashedPassword, 
            tipo 
        });
        res.status(201).json(usuario);
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.updateUsuario = async (req, res) => {
    try {
        const { nombre, email, contraseña, tipo } = req.body;
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        const hashedPassword = contraseña ? await bcrypt.hash(contraseña, 10) : usuario.contraseña;
        await usuario.update({ nombre, email, contraseña: hashedPassword, tipo });
        res.json({ msg: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUsuario = async (req, res) => {
    try {
        const deleted = await Usuario.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json({ msg: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, contraseña } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ msg: 'Credenciales incorrectas' });
        }
        const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!passwordMatch) {
            return res.status(401).json({ msg: 'Credenciales incorrectas' });
        }
        const token = jwt.sign({ id: usuario.id, email: usuario.email,nombre: usuario.nombre, tipo: usuario.tipo }, SECRET_KEY, { expiresIn: '8h' });
        res.status(200).json({ token, msg: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.logout = (req, res) => {
    try {
        res.status(200).json({ msg: 'Sesión cerrada exitosamente' });
    } catch (error) {
        console.error("Error al cerrar la sesión:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.cambiarContrasena = async (req, res) => {
    const { id } = req.params;
    const { contraseña } = req.body;

    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10);
        usuario.contraseña = hashedPassword;
        await usuario.save();

        res.status(200).json({ msg: "Contraseña actualizada exitosamente" });
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        res.status(500).json({ error: error.message });
    }
};
