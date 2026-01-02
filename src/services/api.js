/**
 * API Service - Integração com Sheety
 * 
 * Este ficheiro contém todas as chamadas à API Sheety.
 * Base URL: https://api.sheety.co/231b2b4d7d020f5d98082048ef3ae23a/bd
 * 
 * Campos na Google Sheet (receitas):
 * - id, titulo, imagem, tempo, ingredientes, preparacao, likes, categoria
 */

import axios from 'axios';

// ============================================
// CONFIGURAÇÃO
// ============================================
const BASE_URL = 'https://api.sheety.co/231b2b4d7d020f5d98082048ef3ae23a/bd';

// Instância axios configurada
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================
// UTILITÁRIOS - Conversão de campos
// Converte do formato Sheety para o formato usado no frontend
// ============================================

/**
 * Converte uma receita do formato Sheety para o formato do frontend
 * 
 * Sheety (Google Sheets) -> Frontend
 * - imagem -> imagem_url
 * - tempo -> tempo_preparo
 * - preparacao -> instrucoes
 * - categoria -> categoria (já é texto, não precisa de lookup)
 */
const normalizeRecipe = (receita) => ({
    id: receita.id,
    titulo: receita.titulo || '',
    imagem_url: receita.imagem || '',
    tempo_preparo: receita.tempo || '',
    ingredientes: receita.ingredientes || '',
    instrucoes: receita.preparacao || '',
    likes: receita.likes || 0,
    categoria: receita.categoria || 'Sem categoria',
    // Mantém categoria_id como string do nome para compatibilidade com o form
    categoria_id: receita.categoria || '',
});

/**
 * Converte dados do formulário do frontend para o formato do Sheety
 */
const denormalizeRecipe = (data) => ({
    titulo: data.titulo,
    imagem: data.imagem_url,
    tempo: data.tempo_preparo,
    ingredientes: data.ingredientes,
    preparacao: data.instrucoes,
    categoria: data.categoria_id, // No form, categoria_id guarda o nome da categoria
});

// ============================================
// API - CATEGORIAS
// ============================================

/**
 * Obtém todas as categorias
 * GET /categorias
 */
export const getCategories = async () => {
    try {
        const response = await api.get('/categorias');
        return response.data.categorias || [];
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        throw error;
    }
};

/**
 * Obtém uma categoria por ID
 */
export const getCategoryById = async (id) => {
    try {
        const response = await api.get('/categorias');
        const categorias = response.data.categorias || [];
        return categorias.find(c => c.id === parseInt(id)) || null;
    } catch (error) {
        console.error('Erro ao carregar categoria:', error);
        throw error;
    }
};

// ============================================
// API - RECEITAS
// ============================================

/**
 * Obtém todas as receitas
 * GET /receitas
 */
export const getRecipes = async () => {
    try {
        const response = await api.get('/receitas');
        const receitas = response.data.receitas || [];

        // Normaliza cada receita para o formato do frontend
        return receitas.map(receita => normalizeRecipe(receita));
    } catch (error) {
        console.error('Erro ao carregar receitas:', error);
        throw error;
    }
};

/**
 * Obtém uma receita por ID
 * GET /receitas/{id}
 */
export const getRecipeById = async (id) => {
    try {
        const response = await api.get(`/receitas/${id}`);
        const receita = response.data.receita;

        if (!receita) return null;

        return normalizeRecipe(receita);
    } catch (error) {
        console.error('Erro ao carregar receita:', error);
        throw error;
    }
};

/**
 * Cria uma nova receita
 * POST /receitas
 * Body: { receita: { titulo, imagem, tempo, ingredientes, preparacao, likes, categoria } }
 */
export const createRecipe = async (data) => {
    try {
        const response = await api.post('/receitas', {
            receita: {
                ...denormalizeRecipe(data),
                likes: 0,
            },
        });
        return normalizeRecipe(response.data.receita);
    } catch (error) {
        console.error('Erro ao criar receita:', error);
        throw error;
    }
};

/**
 * Atualiza uma receita existente
 * PUT /receitas/{id}
 * Body: { receita: { ... } }
 */
export const updateRecipe = async (id, data) => {
    try {
        const response = await api.put(`/receitas/${id}`, {
            receita: denormalizeRecipe(data),
        });
        return normalizeRecipe(response.data.receita);
    } catch (error) {
        console.error('Erro ao atualizar receita:', error);
        throw error;
    }
};

/**
 * Elimina uma receita
 * DELETE /receitas/{id}
 */
export const deleteRecipe = async (id) => {
    try {
        await api.delete(`/receitas/${id}`);
        return true;
    } catch (error) {
        console.error('Erro ao eliminar receita:', error);
        throw error;
    }
};

/**
 * Incrementa o like de uma receita
 * Obtém a receita atual, incrementa o like, e faz PUT
 */
export const likeRecipe = async (id) => {
    try {
        // Primeiro, obter os likes atuais
        const receitaRes = await api.get(`/receitas/${id}`);
        const receita = receitaRes.data.receita;

        if (!receita) return null;

        const newLikes = (receita.likes || 0) + 1;

        // Atualizar apenas os likes
        await api.put(`/receitas/${id}`, {
            receita: {
                likes: newLikes,
            },
        });

        return newLikes;
    } catch (error) {
        console.error('Erro ao dar like:', error);
        throw error;
    }
};

// ============================================
// API - AUTENTICAÇÃO (Local - não usa Sheety)
// ============================================

/**
 * Login simulado
 * Credenciais: admin / admin
 */
export const login = async (username, password) => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    if (username === 'admin' && password === 'admin') {
        const token = 'fake_jwt_token_' + Date.now();
        localStorage.setItem('auth_token', token);
        return { success: true, token };
    }
    return { success: false, error: 'Credenciais inválidas' };
};

/**
 * Logout
 */
export const logout = () => {
    localStorage.removeItem('auth_token');
};

/**
 * Verifica se está autenticado
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('auth_token');
};
