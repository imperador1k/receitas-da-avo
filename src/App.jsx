import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

/**
 * App Component
 * Configuração principal das rotas
 */
function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          {/* Frontoffice - Público */}
          <Route path="/" element={<Home />} />
          <Route path="/receita/:id" element={<RecipeDetail />} />

          {/* Backoffice - Privado */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer py-4 mt-5">
        <div className="container text-center">
          <p className="mb-1">
            <i className="bi bi-heart-fill text-sage me-1"></i>
            Receitas da Avó
          </p>
          <small className="text-muted">
            © 2026 - Projeto de Interfaces Web
          </small>
        </div>
      </footer>
    </div>
  );
}

export default App;
