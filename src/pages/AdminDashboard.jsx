/**
 * ============================================
 * ADMIN DASHBOARD - Painel de Administração
 * ============================================
 * 
 * Página protegida (requer autenticação) para gerir receitas.
 * Implementa operações CRUD completas:
 * - CREATE: Adicionar novas receitas
 * - READ: Listar todas as receitas numa tabela
 * - UPDATE: Editar receitas existentes
 * - DELETE: Eliminar receitas (com confirmação)
 * 
 * Componentes:
 * - Cards de estatísticas (total receitas, categorias, likes)
 * - Tabela com todas as receitas
 * - Modais Bootstrap para formulários
 * 
 * API utilizada: getRecipes(), getCategories(), createRecipe(), updateRecipe(), deleteRecipe()
 */

import { useState, useEffect } from 'react';
import { getRecipes, getCategories, createRecipe, updateRecipe, deleteRecipe } from '../services/api';

const AdminDashboard = () => {
    // ============================================
    // ESTADO (useState)
    // ============================================

    // Array com todas as receitas carregadas da API
    const [recipes, setRecipes] = useState([]);

    // Array com todas as categorias (para o dropdown do formulário)
    const [categories, setCategories] = useState([]);

    // Boolean que indica se os dados estão a ser carregados
    const [loading, setLoading] = useState(true);

    // Boolean que controla a visibilidade da modal de adicionar/editar
    const [showModal, setShowModal] = useState(false);

    // Boolean que controla a visibilidade da modal de confirmação de eliminação
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Objeto com a receita a ser editada (null se for para adicionar nova)
    const [editingRecipe, setEditingRecipe] = useState(null);

    // Objeto com a receita a ser eliminada
    const [deletingRecipe, setDeletingRecipe] = useState(null);

    // Boolean que indica se uma operação de save/delete está em progresso
    const [saving, setSaving] = useState(false);

    /**
     * emptyForm - Template do formulário vazio
     * Usado para inicializar o formulário e para limpar após submissão
     */
    const emptyForm = {
        titulo: '',
        imagem_url: '',
        tempo_preparo: '',
        ingredientes: '',
        instrucoes: '',
        categoria_id: ''
    };

    // Estado do formulário (valores dos inputs)
    const [formData, setFormData] = useState(emptyForm);

    // ============================================
    // EFEITOS (useEffect)
    // ============================================

    /**
     * useEffect que corre na montagem do componente.
     * Carrega as receitas e categorias da API.
     */
    useEffect(() => {
        loadData();
    }, []);

    // ============================================
    // FUNÇÕES DE CARREGAMENTO DE DADOS
    // ============================================

    /**
     * loadData - Carrega receitas e categorias da API em paralelo
     * 
     * Usa Promise.all() para fazer os dois pedidos ao mesmo tempo,
     * o que é mais rápido do que fazer um de cada vez.
     */
    const loadData = async () => {
        try {
            setLoading(true);

            // Faz os dois pedidos em paralelo
            const [recipesData, categoriesData] = await Promise.all([
                getRecipes(),
                getCategories()
            ]);

            setRecipes(recipesData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // FUNÇÕES DE MANIPULAÇÃO DO FORMULÁRIO
    // ============================================

    /**
     * handleChange - Atualiza o estado do formulário quando o utilizador escreve
     * 
     * @param {Event} e - Evento de input/change
     * 
     * Funciona para todos os inputs do formulário (text, select, textarea)
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ============================================
    // FUNÇÕES DE CONTROLO DAS MODAIS
    // ============================================

    /**
     * openAddModal - Abre a modal para adicionar uma nova receita
     * 
     * Limpa a receita em edição e reseta o formulário
     */
    const openAddModal = () => {
        setEditingRecipe(null);      // Não está a editar nenhuma
        setFormData(emptyForm);       // Formulário vazio
        setShowModal(true);           // Mostra a modal
    };

    /**
     * openEditModal - Abre a modal para editar uma receita existente
     * 
     * @param {Object} recipe - A receita a editar
     * 
     * Preenche o formulário com os dados da receita selecionada
     */
    const openEditModal = (recipe) => {
        setEditingRecipe(recipe);     // Guarda a receita a editar
        setFormData({                  // Preenche o formulário com os dados
            titulo: recipe.titulo,
            imagem_url: recipe.imagem_url,
            tempo_preparo: recipe.tempo_preparo,
            ingredientes: recipe.ingredientes,
            instrucoes: recipe.instrucoes,
            categoria_id: recipe.categoria || ''
        });
        setShowModal(true);           // Mostra a modal
    };

    /**
     * openDeleteModal - Abre a modal de confirmação para eliminar
     * 
     * @param {Object} recipe - A receita a eliminar
     */
    const openDeleteModal = (recipe) => {
        setDeletingRecipe(recipe);
        setShowDeleteModal(true);
    };

    /**
     * closeModal - Fecha a modal de adicionar/editar
     * 
     * Limpa o estado para evitar dados residuais
     */
    const closeModal = () => {
        setShowModal(false);
        setEditingRecipe(null);
        setFormData(emptyForm);
    };

    /**
     * closeDeleteModal - Fecha a modal de confirmação de eliminação
     */
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletingRecipe(null);
    };

    // ============================================
    // FUNÇÕES DE CRUD (CREATE, UPDATE, DELETE)
    // ============================================

    /**
     * handleSubmit - Processa a submissão do formulário (Create ou Update)
     * 
     * @param {Event} e - Evento de submit do formulário
     * 
     * 1. Previne comportamento padrão do formulário
     * 2. Valida campos obrigatórios
     * 3. Decide se é criação ou atualização baseado em editingRecipe
     * 4. Chama a API correspondente
     * 5. Recarrega os dados e fecha a modal
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevenir duplo clique ou submissão vazia
        if (saving) return;
        if (!formData.titulo || !formData.imagem_url || !formData.categoria_id) {
            console.error('Campos obrigatórios em falta');
            return;
        }

        setSaving(true);

        try {
            if (editingRecipe) {
                // UPDATE - Atualizar receita existente
                const updatedRecipe = await updateRecipe(editingRecipe.id, formData);

                // Optimistic UI: Atualiza o estado local imediatamente
                setRecipes(prev => prev.map(r =>
                    r.id === editingRecipe.id ? updatedRecipe : r
                ));
            } else {
                // CREATE - Criar nova receita
                const newRecipe = await createRecipe(formData);

                // Optimistic UI: Adiciona a nova receita ao estado local
                setRecipes(prev => [...prev, newRecipe]);
            }

            // Fecha a modal
            closeModal();
        } catch (error) {
            console.error('Erro ao guardar receita:', error);
            // Em caso de erro, recarrega para garantir consistência
            await loadData();
        } finally {
            setSaving(false);
        }
    };

    /**
     * handleDelete - Processa a eliminação de uma receita
     * 
     * Usa "Optimistic UI" - remove do estado local imediatamente
     * sem esperar pela propagação da API (Sheety é lenta)
     */
    const handleDelete = async () => {
        if (!deletingRecipe) return;

        setSaving(true);
        try {
            // DELETE - Eliminar a receita na API
            await deleteRecipe(deletingRecipe.id);

            // Optimistic UI: Remove do estado local imediatamente
            setRecipes(prev => prev.filter(r => r.id !== deletingRecipe.id));

            // Fecha a modal de confirmação
            closeDeleteModal();
        } catch (error) {
            console.error('Erro ao eliminar receita:', error);
            // Em caso de erro, recarrega para garantir consistência
            await loadData();
        } finally {
            setSaving(false);
        }
    };

    // ============================================
    // RENDER CONDICIONAL - LOADING
    // ============================================

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-sage" role="status">
                    <span className="visually-hidden">A carregar...</span>
                </div>
            </div>
        );
    }

    // ============================================
    // RENDER PRINCIPAL (JSX)
    // ============================================
    return (
        <div className="admin-dashboard py-5">
            <div className="container">
                {/* ========== HEADER ========== */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="fw-bold mb-1">
                            <i className="bi bi-grid-3x3-gap text-sage me-2"></i>
                            Dashboard
                        </h1>
                        <p className="text-muted mb-0">Gerir as receitas do livro de receitas</p>
                    </div>
                    {/* Botão para abrir modal de adicionar */}
                    <button className="btn btn-sage" onClick={openAddModal}>
                        <i className="bi bi-plus-lg me-2"></i>
                        Adicionar Receita
                    </button>
                </div>

                {/* ========== CARDS DE ESTATÍSTICAS ========== */}
                <div className="row g-4 mb-4">
                    {/* Card: Total de Receitas */}
                    <div className="col-md-4">
                        <div className="stat-card">
                            <div className="stat-icon bg-sage-light">
                                <i className="bi bi-book"></i>
                            </div>
                            <div>
                                <h3 className="mb-0">{recipes.length}</h3>
                                <span className="text-muted">Total de Receitas</span>
                            </div>
                        </div>
                    </div>

                    {/* Card: Categorias */}
                    <div className="col-md-4">
                        <div className="stat-card">
                            <div className="stat-icon bg-warning-light">
                                <i className="bi bi-tag"></i>
                            </div>
                            <div>
                                <h3 className="mb-0">{categories.length}</h3>
                                <span className="text-muted">Categorias</span>
                            </div>
                        </div>
                    </div>

                    {/* Card: Total de Likes */}
                    <div className="col-md-4">
                        <div className="stat-card">
                            <div className="stat-icon bg-danger-light">
                                <i className="bi bi-heart"></i>
                            </div>
                            <div>
                                {/* Usa .reduce() para somar todos os likes */}
                                <h3 className="mb-0">{recipes.reduce((acc, r) => acc + r.likes, 0)}</h3>
                                <span className="text-muted">Total de Likes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== TABELA DE RECEITAS ========== */}
                <div className="table-card">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: '60px' }}>Img</th>
                                    <th>Título</th>
                                    <th>Categoria</th>
                                    <th>Tempo</th>
                                    <th>Likes</th>
                                    <th style={{ width: '140px' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Itera sobre todas as receitas */}
                                {recipes.map(recipe => (
                                    <tr key={recipe.id}>
                                        <td>
                                            <img
                                                src={recipe.imagem_url}
                                                alt={recipe.titulo}
                                                className="table-img"
                                            />
                                        </td>
                                        <td className="fw-medium">{recipe.titulo}</td>
                                        <td>
                                            <span className="badge bg-sage-light text-sage">
                                                {recipe.categoria}
                                            </span>
                                        </td>
                                        <td>{recipe.tempo_preparo}</td>
                                        <td>
                                            <i className="bi bi-heart-fill text-danger me-1"></i>
                                            {recipe.likes}
                                        </td>
                                        <td>
                                            {/* Botão Editar */}
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => openEditModal(recipe)}
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            {/* Botão Eliminar */}
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => openDeleteModal(recipe)}
                                                title="Eliminar"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ========== MODAL DE ADICIONAR/EDITAR ========== */}
            {/* Só renderiza se showModal for true */}
            {showModal && (
                <div className="modal-backdrop-custom" onClick={closeModal}>
                    {/* stopPropagation impede que o clique no conteúdo feche a modal */}
                    <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            {/* Header da Modal */}
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className={`bi ${editingRecipe ? 'bi-pencil' : 'bi-plus-lg'} me-2`}></i>
                                    {editingRecipe ? 'Editar Receita' : 'Adicionar Receita'}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>

                            {/* Formulário */}
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        {/* Campo: Título */}
                                        <div className="col-12">
                                            <label className="form-label">Título</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="titulo"
                                                value={formData.titulo}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Campo: URL da Imagem */}
                                        <div className="col-md-8">
                                            <label className="form-label">URL da Imagem</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                name="imagem_url"
                                                value={formData.imagem_url}
                                                onChange={handleChange}
                                                placeholder="https://..."
                                                required
                                            />
                                        </div>

                                        {/* Campo: Tempo de Preparo */}
                                        <div className="col-md-4">
                                            <label className="form-label">Tempo de Preparo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="tempo_preparo"
                                                value={formData.tempo_preparo}
                                                onChange={handleChange}
                                                placeholder="Ex: 45 min"
                                                required
                                            />
                                        </div>

                                        {/* Campo: Categoria (dropdown) */}
                                        <div className="col-12">
                                            <label className="form-label">Categoria</label>
                                            <select
                                                className="form-select"
                                                name="categoria_id"
                                                value={formData.categoria_id}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Selecionar categoria...</option>
                                                {/* Popula o dropdown com as categorias da API */}
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Campo: Ingredientes (textarea) */}
                                        <div className="col-12">
                                            <label className="form-label">Ingredientes</label>
                                            <textarea
                                                className="form-control"
                                                name="ingredientes"
                                                value={formData.ingredientes}
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder="Um ingrediente por linha..."
                                                required
                                            ></textarea>
                                        </div>

                                        {/* Campo: Instruções (textarea) */}
                                        <div className="col-12">
                                            <label className="form-label">Instruções</label>
                                            <textarea
                                                className="form-control"
                                                name="instrucoes"
                                                value={formData.instrucoes}
                                                onChange={handleChange}
                                                rows="5"
                                                placeholder="Passos de preparação..."
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer da Modal com botões */}
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-sage" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                A guardar...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-lg me-2"></i>
                                                {editingRecipe ? 'Guardar Alterações' : 'Adicionar'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== MODAL DE CONFIRMAÇÃO DE ELIMINAÇÃO ========== */}
            {showDeleteModal && (
                <div className="modal-backdrop-custom" onClick={closeDeleteModal}>
                    <div className="modal-dialog-custom modal-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-danger">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    Confirmar Eliminação
                                </h5>
                                <button type="button" className="btn-close" onClick={closeDeleteModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Tem a certeza que deseja eliminar a receita:</p>
                                <p className="fw-bold">"{deletingRecipe?.titulo}"</p>
                                <p className="text-muted small mb-0">Esta ação não pode ser revertida.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" onClick={closeDeleteModal}>
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            A eliminar...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-trash me-2"></i>
                                            Eliminar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
