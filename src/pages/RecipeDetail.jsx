/**
 * ============================================
 * RECIPE DETAIL PAGE - Página de Detalhe da Receita
 * ============================================
 * 
 * Esta página exibe os detalhes completos de uma receita:
 * - Imagem em destaque com badge de categoria
 * - Tempo de preparação
 * - Lista de ingredientes
 * - Instruções de preparação
 * - Botão de Like (incrementa contador na API)
 * 
 * Parâmetros URL: /receita/:id
 * API utilizada: getRecipeById(), likeRecipe()
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, likeRecipe } from '../services/api';

const RecipeDetail = () => {
    // ============================================
    // HOOKS DO REACT ROUTER
    // ============================================

    /**
     * useParams() - Extrai parâmetros da URL
     * Neste caso, extrai o "id" de /receita/:id
     */
    const { id } = useParams();

    /**
     * useNavigate() - Permite navegar programaticamente
     * Usado para voltar à página anterior ou ir para o início
     */
    const navigate = useNavigate();

    // ============================================
    // ESTADO (useState)
    // ============================================

    // Objeto com todos os dados da receita (ou null se não carregada)
    const [recipe, setRecipe] = useState(null);

    // Boolean que indica se os dados ainda estão a ser carregados
    const [loading, setLoading] = useState(true);

    // Número de likes da receita (atualizado localmente após like)
    const [likes, setLikes] = useState(0);

    // Boolean que indica se o like está a ser processado (previne duplo clique)
    const [isLiking, setIsLiking] = useState(false);

    // Boolean que indica se o utilizador já deu like (guardado no localStorage)
    const [liked, setLiked] = useState(false);

    // ============================================
    // EFEITOS (useEffect)
    // ============================================

    /**
     * useEffect que corre quando o ID muda.
     * Carrega os dados da receita correspondente ao ID na URL.
     */
    useEffect(() => {
        loadRecipe();
    }, [id]);

    // ============================================
    // FUNÇÕES
    // ============================================

    /**
     * loadRecipe - Carrega os dados da receita da API
     * 
     * 1. Ativa o estado de loading
     * 2. Chama a API com o ID da receita
     * 3. Se encontrar, guarda os dados e verifica se já deu like
     * 4. Desativa o loading
     */
    const loadRecipe = async () => {
        try {
            setLoading(true);
            const data = await getRecipeById(id);
            if (data) {
                setRecipe(data);
                setLikes(data.likes);

                // Verificar se o utilizador já deu like a esta receita
                // Os IDs das receitas "liked" são guardados no localStorage
                const likedRecipes = JSON.parse(localStorage.getItem('liked_recipes') || '[]');
                setLiked(likedRecipes.includes(parseInt(id)));
            }
        } catch (error) {
            console.error('Erro ao carregar receita:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * handleLike - Processa o clique no botão de like
     * 
     * 1. Verifica se já está a processar ou se já deu like
     * 2. Chama a API para incrementar o like
     * 3. Atualiza o contador local
     * 4. Guarda no localStorage para não permitir dar like novamente
     */
    const handleLike = async () => {
        // Prevenir duplo clique ou like repetido
        if (isLiking || liked) return;

        try {
            setIsLiking(true);

            // Chama a API para incrementar o like
            const newLikes = await likeRecipe(id);

            if (newLikes !== null) {
                // Atualiza o contador visualmente
                setLikes(newLikes);
                setLiked(true);

                // Guarda no localStorage que o utilizador já deu like
                const likedRecipes = JSON.parse(localStorage.getItem('liked_recipes') || '[]');
                likedRecipes.push(parseInt(id));
                localStorage.setItem('liked_recipes', JSON.stringify(likedRecipes));
            }
        } catch (error) {
            console.error('Erro ao dar like:', error);
        } finally {
            setIsLiking(false);
        }
    };

    // ============================================
    // RENDER CONDICIONAL
    // ============================================

    // Mostra spinner enquanto carrega
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-sage" role="status">
                    <span className="visually-hidden">A carregar...</span>
                </div>
            </div>
        );
    }

    // Mostra mensagem de erro se a receita não existe
    if (!recipe) {
        return (
            <div className="container py-5 text-center">
                <i className="bi bi-exclamation-circle display-1 text-muted"></i>
                <h2 className="mt-3">Receita não encontrada</h2>
                <button className="btn btn-sage mt-3" onClick={() => navigate('/')}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Voltar ao início
                </button>
            </div>
        );
    }

    // ============================================
    // RENDER PRINCIPAL (JSX)
    // ============================================
    return (
        <div className="recipe-detail-page py-5">
            <div className="container">
                {/* Botão Voltar - usa navigate(-1) para voltar à página anterior */}
                <button
                    className="btn btn-outline-secondary mb-4"
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Voltar
                </button>

                <div className="row g-5">
                    {/* ========== COLUNA DA IMAGEM ========== */}
                    <div className="col-lg-6">
                        <div className="recipe-image-wrapper">
                            <img
                                src={recipe.imagem_url}
                                alt={recipe.titulo}
                                className="recipe-image"
                            />
                            {/* Badge com a categoria */}
                            <span className="category-badge-lg">
                                {recipe.categoria}
                            </span>
                        </div>
                    </div>

                    {/* ========== COLUNA DE INFORMAÇÕES ========== */}
                    <div className="col-lg-6">
                        <h1 className="recipe-title mb-3">{recipe.titulo}</h1>

                        {/* Meta informações: tempo e likes */}
                        <div className="d-flex gap-4 mb-4">
                            {/* Badge de tempo de preparação */}
                            <span className="meta-badge">
                                <i className="bi bi-clock me-2"></i>
                                {recipe.tempo_preparo}
                            </span>

                            {/* Botão de Like */}
                            <button
                                className={`like-button ${liked ? 'liked' : ''}`}
                                onClick={handleLike}
                                disabled={isLiking || liked}
                            >
                                <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
                                <span>{likes}</span>
                            </button>
                        </div>

                        {/* Secção de Ingredientes */}
                        <div className="recipe-section">
                            <h3 className="section-title">
                                <i className="bi bi-basket me-2"></i>
                                Ingredientes
                            </h3>
                            <div className="ingredients-box">
                                {/* Divide os ingredientes por quebra de linha e cria uma div para cada */}
                                {recipe.ingredientes.split('\n').map((ingredient, index) => (
                                    <div key={index} className="ingredient-item">
                                        <i className="bi bi-check2 text-sage me-2"></i>
                                        {ingredient}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== SECÇÃO DE INSTRUÇÕES ========== */}
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="recipe-section">
                            <h3 className="section-title">
                                <i className="bi bi-list-ol me-2"></i>
                                Modo de Preparação
                            </h3>
                            <div className="instructions-box">
                                {/* Divide as instruções por quebra de linha */}
                                {recipe.instrucoes.split('\n').map((step, index) => (
                                    <div key={index} className="instruction-step">
                                        {step}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
