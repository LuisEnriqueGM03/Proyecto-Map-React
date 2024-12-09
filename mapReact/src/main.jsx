import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './pages/Admin/Usuario/Login.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import DashboardVerificador from './pages/Admin/VerificardoresDashboard.jsx';
import ListaUsuarios from './pages/Admin/Usuario/UsuariosList.jsx';
import FormUsuario from './pages/Admin/Usuario/UsuarioForm.jsx';
import FormCambiarContraseña from './pages/Admin/Usuario/UsuarioPassword.jsx';
import TiposIncidentes from './pages/Admin/TiposIncidentes/tiposIncidentes.jsx';
import FormTipoIncidente from './pages/Admin/TiposIncidentes/tiposIncidentesForm.jsx';
import Municipios from './pages/Admin/Municipios/Municipios.jsx';
import FormMunicipio from './pages/Admin/Municipios/MunicipiosForm.jsx';
import FormCarretera from './pages/Admin/Carretera/FormCarretera.jsx';
import CarreteraList from './pages/Admin/Carretera/Carretera.jsx';
import ListaSolicitudes from './pages/Admin/Solicitudes/Solicitudes.jsx';
import FormIncidentes from './pages/Admin/Incidentes/IncidentesForm.jsx';
import ListaIncidentes from './pages/Admin/Incidentes/Incidentes.jsx';
import ListaHistorial from './pages/Admin/Historial/Historial.jsx';
import Principal from './pages/Admin/Principal.jsx';




const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  }
  ,
  {
    path: "/login",
      element: <Login/> ,
  },
  {
    path: "/adminDashboard",
    element: <AdminDashboard/>,
  },
  {
    path: "/verificadorDashboard",
    element: <DashboardVerificador/>,
  },{
    path: "/usuarioslista",
    element: <ListaUsuarios/>,
  },
  
    {
      path: "/usuarios/crear",
        element: <FormUsuario/>,
    },
    {
      path: "/usuarios/:id/editar",
        element: <FormUsuario/>,
    },
    {
      path: "/usuarios/:id/contraseña",
        element: <FormCambiarContraseña/>,
    },
    {
      path:"/tiposincidentes",
      element:<TiposIncidentes/>
    },
    {
      path:"/tiposincidentes/crear",
      element:<FormTipoIncidente/>
    },
    {
      path:"/tiposincidentes/:id/editar",
      element:<FormTipoIncidente/>
    },
    {
      path:"/Municipios",
      element:<Municipios/>

    },
    {
      path:"/Municipios/crear",
      element:<FormMunicipio/>
    },
    {
      path:"/Municipios/:id/editar",
      element:<FormMunicipio/>
    },
    {
      path:"/Carretera/crear",
      element:<FormCarretera/>
    }
    ,
    {
      path:"/Carretera/:id/editar",
      element:<FormCarretera/>
    }
    ,
    {
      path:"/carretera",
      element:<CarreteraList/>
    },
    {
      path:"/solicitudes",
      element:<ListaSolicitudes/>
    },
    {
      path:"/incidentes/crear",
      element:<FormIncidentes/>
    },
    {
      path:"/incidentes/:id/Editar",
      element:<FormIncidentes/>
    },
    {
      path:"/Incidentes",
      element:<ListaIncidentes/>
    },
    {
      path:"/Historial",
      element:<ListaHistorial/>
    },
    {
      path:"/Principal",
      element:<Principal/>
    }



]);


createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
);
