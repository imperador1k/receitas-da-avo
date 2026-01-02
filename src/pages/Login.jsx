/**
 * ============================================
 * LOGIN PAGE - Página de Login
 * ============================================
 * 
 * Página de autenticação para aceder ao backoffice (área de administração).
 * 
 * Funcionalidades:
 * - Formulário com username e password
 * - Validação de credenciais (admin/admin)
 * - Mensagens de erro
 * - Redirecionamento automático se já autenticado
 * - Estado de loading durante a autenticação
 * 
 * API utilizada: login(), isAuthenticated()
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated } from '../services/api';

const Login = () => {
    // ============================================
    // HOOKS DO REACT ROUTER
    // ============================================

    /**
     * useNavigate() - Permite navegar programaticamente
     * Usado para redirecionar para o dashboard após login
     */
    const navigate = useNavigate();

    // ============================================
    // ESTADO (useState)
    // ============================================

    /**
     * formData - Objeto que guarda os valores do formulário
     * Atualizado a cada keystroke nos inputs
     */
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // String com a mensagem de erro (vazia se não houver erro)
    const [error, setError] = useState('');

    // Boolean que indica se o login está a ser processado
    const [loading, setLoading] = useState(false);

    // ============================================
    // VERIFICAÇÃO DE AUTENTICAÇÃO
    // ============================================

    /**
     * Se o utilizador já está autenticado (tem token no localStorage),
     * redireciona automaticamente para o dashboard.
     * Retorna null para não renderizar o formulário.
     */
    if (isAuthenticated()) {
        navigate('/admin');
        return null;
    }

    // ============================================
    // FUNÇÕES
    // ============================================

    /**
     * handleChange - Atualiza o estado do formulário quando o utilizador escreve
     * 
     * @param {Event} e - Evento de input
     * 
     * Usa destructuring para extrair name e value do input.
     * Atualiza apenas o campo que mudou, mantendo os outros.
     * Também limpa a mensagem de erro ao começar a escrever.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,      // Mantém os valores anteriores
            [name]: value // Atualiza o campo específico
        }));
        setError(''); // Limpa o erro ao digitar
    };

    /**
     * handleSubmit - Processa a submissão do formulário de login
     * 
     * @param {Event} e - Evento de submit do formulário
     * 
     * 1. Previne o comportamento padrão do formulário (recarregar página)
     * 2. Ativa o estado de loading
     * 3. Chama a API de login com as credenciais
     * 4. Se sucesso, redireciona para o dashboard
     * 5. Se erro, mostra a mensagem de erro
     */
    const handleSubmit = async (e) => {
        e.preventDefault();  // Previne reload da página
        setError('');        // Limpa erros anteriores
        setLoading(true);    // Ativa loading

        try {
            // Chama a função de login da API
            const result = await login(formData.username, formData.password);

            if (result.success) {
                // Login bem-sucedido - redireciona para o dashboard
                navigate('/admin');
            } else {
                // Credenciais inválidas - mostra erro
                setError(result.error);
            }
        } catch (err) {
            // Erro de rede ou outro erro inesperado
            setError('Ocorreu um erro. Tente novamente.');
        } finally {
            // Desativa loading (corre sempre, mesmo com erro)
            setLoading(false);
        }
    };

    // ============================================
    // RENDER (JSX)
    // ============================================
    return (
        <div className="login-page d-flex align-items-center min-vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5 col-xl-4">
                        <div className="login-card">
                            {/* ========== HEADER DO CARD ========== */}
                            <div className="text-center mb-4">
                                <div className="login-icon mb-3">
                                    <i className="bi bi-person-circle"></i>
                                </div>
                                <h2 className="fw-bold">Área de Administração</h2>
                                <p className="text-muted">Entre para gerir as suas receitas</p>
                            </div>

                            {/* ========== ALERTA DE ERRO ========== */}
                            {/* Só aparece se houver uma mensagem de erro */}
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                </div>
                            )}

                            {/* ========== FORMULÁRIO ========== */}
                            <form onSubmit={handleSubmit}>
                                {/* Campo Username */}
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">
                                        <i className="bi bi-person me-2"></i>
                                        Utilizador
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Digite o seu utilizador"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {/* Campo Password */}
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">
                                        <i className="bi bi-lock me-2"></i>
                                        Palavra-passe
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Digite a sua palavra-passe"
                                        required
                                    />
                                </div>

                                {/* Botão de Submit */}
                                <button
                                    type="submit"
                                    className="btn btn-sage btn-lg w-100"
                                    disabled={loading}
                                >
                                    {/* Conteúdo dinâmico: spinner durante loading ou texto normal */}
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            A entrar...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-box-arrow-in-right me-2"></i>
                                            Entrar
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* ========== DICA DE CREDENCIAIS ========== */}
                            <div className="text-center mt-4">
                                <small className="text-muted">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Dica: admin / admin
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
