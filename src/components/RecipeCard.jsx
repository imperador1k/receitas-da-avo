import { Link } from 'react-router-dom';

/**
 * RecipeCard Component
 * Card de receita com imagem, informações e contador de likes
 */
const RecipeCard = ({ recipe }) => {
    const { id, titulo, imagem_url, tempo_preparo, categoria, likes } = recipe;

    return (
        <div className="col">
            <Link to={`/receita/${id}`} className="text-decoration-none">
                <div className="card recipe-card h-100">
                    {/* Imagem */}
                    <div className="card-img-wrapper">
                        <img
                            src={imagem_url}
                            className="card-img-top"
                            alt={titulo}
                            loading="lazy"
                        />
                        {/* Badge de categoria */}
                        <span className="category-badge">
                            {categoria}
                        </span>
                    </div>

                    {/* Conteúdo */}
                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title mb-2">{titulo}</h5>

                        <div className="mt-auto d-flex justify-content-between align-items-center">
                            {/* Tempo de preparo */}
                            <span className="text-muted small">
                                <i className="bi bi-clock me-1"></i>
                                {tempo_preparo}
                            </span>

                            {/* Likes */}
                            <span className="likes-badge">
                                <i className="bi bi-heart-fill me-1"></i>
                                {likes}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default RecipeCard;
