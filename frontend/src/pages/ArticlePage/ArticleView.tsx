import React from "react";
import "../../styles/article.css";

interface ArticleViewProps {
  article_id: number;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article_id }) => {
  return (
    <div className="article-view">
      <h1 className="view-title">{"title"}</h1>

      <div className="view-content">{article_id}</div>
    </div>
  );
};

export default ArticleView;
