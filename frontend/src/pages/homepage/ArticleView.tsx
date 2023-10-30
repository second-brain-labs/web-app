import React from 'react';
import '../article.css';

interface ArticleViewProps {
    title: string;
    content: string;
    imageUrl?: string;
}

const ArticleView: React.FC<ArticleViewProps> = ({ title, content, imageUrl }) => {
    return (
        <div className="article-view">
            <h1 className="view-title">{title}</h1>
            {imageUrl && <img src={imageUrl} alt={title} className="view-image" />}
            <div className="view-content">
                {content}
            </div>
        </div>
    );
}

export default ArticleView;
