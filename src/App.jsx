import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboarddLayout'
import Usuarios from './pages/Usuarios'
import Dispositivos from './pages/Dispositivos'
import { Panel } from './pages/Panel';

// 1. Creamos un subcomponente para usar useLocation (necesita estar dentro del Router)
function AppContent() {
  const location = useLocation();
  
  // 2. Condicionamos la clase dependiendo de la ruta
  const isLoginRoute = location.pathname === '/login';
  const containerClasses = isLoginRoute 
    ? "flex h-screen w-screen justify-center items-center bg-gray-200" // Estilo para el Login
    : "h-screen w-screen bg-white"; // Estilo por defecto para el Dashboard u otras rutas

  return (
    <div className={containerClasses}>
      <Routes>
        <Route path='/login' element={<Login />} />

        <Route
          path='/panel'
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Panel />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="dispositivos" element={<Dispositivos />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

// 3. Modificamos App para que Router envuelva al contenido
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App;