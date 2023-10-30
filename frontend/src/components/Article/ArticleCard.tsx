import React from 'react';
import "../../styles/article.css"

interface ArticleProps {
    title: string;
    summary: string;
    imageUrl?: string;
    onClick?: () => void;
}

const ArticleCard: React.FC<ArticleProps> = ({ title, summary, imageUrl, onClick }) => {
    return (
        <div className="article-card" onClick={onClick}>
            {imageUrl && <img src={imageUrl} alt={title} className="article-image" />}
            <h2 className="article-title">{title}</h2>
            <p className="article-summary">{summary}</p>
        </div>
    );
}

export default ArticleCard;
