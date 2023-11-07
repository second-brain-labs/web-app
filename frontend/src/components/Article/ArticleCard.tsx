import React from 'react';
import "../../styles/article.css";
import ArticleImg from "../../assets/images/article.png";

interface ArticleProps {
    title: string;
    onClick: () => void;
}

const ArticleCard = ({ title, onClick }: ArticleProps) => {
    return (
        <div className="article-card" onClick={onClick}>
            <img src={ArticleImg} alt={title} className="article-image"/>
            <h2 className="article-title">{title}</h2>
        </div>
    );
}

export default ArticleCard;
