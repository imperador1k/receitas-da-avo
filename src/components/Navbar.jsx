import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../services/api';

/**
 * Navbar Component
 * Barra de navegação responsiva com Bootstrap e estilo customizado
 */
const Navbar = () => {
    const navigate = useNavigate();
    const loggedIn = isAuthenticated();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
            <div className="container">
                {/* Brand */}
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <i className="bi bi-book-half text-sage fs-4"></i>
                    <span className="fw-semibold">Receitas da Avó</span>
                </Link>

                {/* Mobile Toggle */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <i className="bi bi-list fs-3"></i>
                </button>

                {/* Nav Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center gap-2">
                        <li className="nav-item">
                            <Link className="nav-link px-3" to="/">
                                <i className="bi bi-house-door me-1"></i>
                                Início
                            </Link>
                        </li>

                        {loggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/admin">
                                        <i className="bi bi-grid-3x3-gap me-1"></i>
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-sage btn-sm px-3"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right me-1"></i>
                                        Sair
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="btn btn-sage btn-sm px-4" to="/login">
                                    <i className="bi bi-person me-1"></i>
                                    Entrar
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
