/**
 * ============================================
 * HOME PAGE - Página Principal
 * ============================================
 * 
 * Esta página exibe a lista de receitas com funcionalidades de:
 * - Pesquisa por nome (filtro em tempo real)
 * - Paginação (6 receitas por página)
 * - Grid responsivo (1/2/3 colunas conforme o tamanho do ecrã)
 * 
 * Componentes utilizados: RecipeCard
 * API utilizada: getRecipes()
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
    // ============================================
    // HOOKS
    // ============================================

    // useLocation para detetar navegação de volta para esta página
    const location = useLocation();

    // ============================================
    // ESTADO (useState)
    // ============================================

    // Array que guarda todas as receitas carregadas da API
    const [recipes, setRecipes] = useState([]);

    // Boolean que indica se os dados ainda estão a ser carregados
    const [loading, setLoading] = useState(true);

    // String com o termo de pesquisa introduzido pelo utilizador
    const [searchTerm, setSearchTerm] = useState('');

    // Número da página atual na paginação (começa em 1)
    const [currentPage, setCurrentPage] = useState(1);

    // Constante que define quantas receitas mostrar por página
    const recipesPerPage = 6;

    // ============================================
    // EFEITOS (useEffect)
    // ============================================

    /**
     * useEffect que corre quando o componente é montado OU quando
     * o utilizador navega para esta página (location.key muda em cada navegação).
     * Isto garante que os likes são sempre atualizados ao voltar.
     */
    useEffect(() => {
        loadRecipes();
    }, [location.key]);

    /**
     * useEffect que corre sempre que o termo de pesquisa muda.
     * Reseta a página para 1 para mostrar os primeiros resultados filtrados.
     */
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // ============================================
    // FUNÇÕES
    // ============================================

    /**
     * loadRecipes - Carrega todas as receitas da API
     * 
     * Esta função é assíncrona (async) porque faz um pedido à API.
     * 1. Ativa o estado de loading
     * 2. Chama a API para obter as receitas
     * 3. Guarda as receitas no estado
     * 4. Desativa o loading (mesmo se houver erro)
     */
    const loadRecipes = async () => {
        try {
            setLoading(true);
            const data = await getRecipes();
            setRecipes(data);
        } catch (error) {
            console.error('Erro ao carregar receitas:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // LÓGICA DE FILTRAGEM E PAGINAÇÃO
    // ============================================

    /**
     * Filtra as receitas com base no termo de pesquisa.
     * Usa .filter() para manter apenas receitas cujo título
     * contém o termo pesquisado (case-insensitive).
     */
    const filteredRecipes = recipes.filter(recipe =>
        recipe.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /**
     * Calcula o número total de páginas.
     * Math.ceil() arredonda para cima (ex: 7/6 = 2 páginas).
     */
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

    /**
     * Calcula o índice inicial para a página atual.
     * Página 1 = índice 0, Página 2 = índice 6, etc.
     */
    const startIndex = (currentPage - 1) * recipesPerPage;

    /**
     * Extrai apenas as receitas da página atual.
     * .slice(início, fim) retorna uma porção do array.
     */
    const paginatedRecipes = filteredRecipes.slice(startIndex, startIndex + recipesPerPage);

    // ============================================
    // RENDER (JSX)
    // ============================================
    return (
        <div className="home-page">
            {/* ========== HERO SECTION ========== */}
            {/* Secção de destaque com título e barra de pesquisa */}
            <section className="hero-section">
                <div className="container">
                    {/* Decoração superior */}
                    <div className="hero-decoration">
                        <span className="decoration-line"></span>
                        <span className="decoration-icon">🍲</span>
                        <span className="decoration-line"></span>
                    </div>

                    {/* Título principal */}
                    <h1 className="hero-title">
                        Receitas da Avó
                    </h1>

                    {/* Subtítulo com destaque */}
                    <p className="hero-subtitle">
                        Descubra as receitas <span className="highlight">tradicionais</span> passadas
                        de geração em geração
                    </p>

                    {/* Barra de Pesquisa */}
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="search-wrapper">
                                <i className="bi bi-search search-icon"></i>
                                <input
                                    type="text"
                                    className="form-control search-input"
                                    placeholder="O que vai cozinhar hoje?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {/* Botão X para limpar a pesquisa (só aparece se houver texto) */}
                                {searchTerm && (
                                    <button
                                        className="btn-clear"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tags de categorias populares */}
                    <div className="hero-tags">
                        <span className="hero-tag" onClick={() => setSearchTerm('Galinha')}>🐔 Galinha</span>
                        <span className="hero-tag" onClick={() => setSearchTerm('Sopa')}>🥣 Sopa</span>
                        <span className="hero-tag" onClick={() => setSearchTerm('Dourada')}>🐟 Dourada</span>
                        <span className="hero-tag" onClick={() => setSearchTerm('Pato')}>🦆 Pato</span>
                    </div>
                </div>
            </section>

            {/* ========== SECÇÃO DE RECEITAS ========== */}
            <section className="recipes-section py-5">
                <div className="container">
                    {/* Estado de Loading - mostra spinner enquanto carrega */}
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-sage" role="status">
                                <span className="visually-hidden">A carregar...</span>
                            </div>
                            <p className="mt-3 text-muted">A carregar receitas...</p>
                        </div>
                    ) : paginatedRecipes.length === 0 ? (
                        /* Mensagem quando não há resultados */
                        <div className="text-center py-5">
                            <i className="bi bi-search display-1 text-muted"></i>
                            <p className="mt-3 text-muted">
                                Nenhuma receita encontrada para "{searchTerm}"
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Grid de Receitas - responsivo com Bootstrap */}
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                {paginatedRecipes.map(recipe => (
                                    <RecipeCard key={recipe.id} recipe={recipe} />
                                ))}
                            </div>

                            {/* Paginação - só aparece se houver mais de 1 página */}
                            {totalPages > 1 && (
                                <nav className="mt-5" aria-label="Navegação de páginas">
                                    <ul className="pagination justify-content-center">
                                        {/* Botão Anterior */}
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                <i className="bi bi-chevron-left"></i>
                                            </button>
                                        </li>

                                        {/* Números das páginas */}
                                        {[...Array(totalPages)].map((_, index) => (
                                            <li
                                                key={index + 1}
                                                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(index + 1)}
                                                >
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))}

                                        {/* Botão Seguinte */}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                <i className="bi bi-chevron-right"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}

                            {/* Contador de resultados */}
                            <p className="text-center text-muted mt-3">
                                A mostrar {paginatedRecipes.length} de {filteredRecipes.length} receitas
                            </p>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
