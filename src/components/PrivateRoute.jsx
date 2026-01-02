import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

/**
 * PrivateRoute Component
 * Protege rotas que requerem autenticação
 * Redireciona para /login se não autenticado
 */
const PrivateRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
