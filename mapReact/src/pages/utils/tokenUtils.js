import jwt_decode from 'jwt-decode';


export const obtenerToken = () => {
    try {
        const token = localStorage.getItem("token");
        return token ? token : null;
    } catch (error) {
        console.error("Error al obtener el token:", error);
        return null;
    }
};

export const decodificarToken = (token) => {
    try {
        const decodedToken = jwt_decode(token);
        return decodedToken;
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
};

export const obtenerUsuarioIdDesdeToken = () => {
    try {
        const token = obtenerToken();
        if (!token) return null;
        
        const decodedToken = decodificarToken(token);
        return decodedToken?.usuarioId || decodedToken?.id || null;
    } catch (error) {
        console.error("Error al obtener el ID del usuario desde el token:", error);
        return null;
    }
};

export const obtenerUsuarioNombreDesdeToken = () => {
    try {
        const token = obtenerToken();
        if (!token) return null;
        
        const decodedToken = decodificarToken(token);
        return decodedToken?.nombre || null; 
    } catch (error) {
        console.error("Error al obtener el nombre del usuario desde el token:", error);
        return null;
    }
};

export const obtenerTipoUsuarioDesdeToken = () => {
    try {
        const token = obtenerToken();
        if (!token) return null;

        const decodedToken = decodificarToken(token);
        return decodedToken?.tipo || null; 
    } catch (error) {
        console.error("Error al obtener el tipo de usuario desde el token:", error);
        return null;
    }
};

export const verificarExpiracionToken = () => {
    try {
        const token = obtenerToken();
        if (!token) return true;

        const decodedToken = decodificarToken(token);
        const now = Date.now() / 1000;
        return decodedToken?.exp ? decodedToken.exp < now : true;
    } catch (error) {
        console.error("Error al verificar la expiración del token:", error);
        return true;
    }
};

export const cerrarSesion = () => {
    try {
        localStorage.removeItem("token");
    } catch (error) {
        console.error("Error al cerrar sesión y eliminar el token:", error);
    }
};

export const establecerToken = (token) => {
    try {
        localStorage.setItem("token", token);
    } catch (error) {
        console.error("Error al establecer el token en localStorage:", error);
    }
};
