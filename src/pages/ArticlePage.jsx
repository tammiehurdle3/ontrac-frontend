// src/pages/ArticlePage.jsx
import React, { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { articles } from '../data/articles';

function ArticlePage() {
  const { articleId } = useParams();
  const article = articles.find((art) => art.id === articleId);
  const location = useLocation();

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (!article) {
    return (
      <div className="container article-container">
        <h2>Article not found</h2>
        <Link to="/knowledge-center">Back to Knowledge Center</Link>
      </div>
    );
  }

  return (
    <div className="container article-container">
      <h1 className="article-title">{article.title}</h1>
      {/* dangerouslySetInnerHTML is safe here because the content is from our own trusted articles.js file */}
      <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
      <Link to="/knowledge-center" className="button back-button">
        &larr; Back to Knowledge Center
      </Link>
    </div>
  );
}

export default ArticlePage;

