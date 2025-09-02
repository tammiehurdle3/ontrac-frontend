// src/pages/KnowledgeCenterPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles'; // Import the articles

function KnowledgeCenterPage() {
  return (
    <div className="container knowledge-center-container">
      <h1 className="knowledge-center-title">Knowledge Center</h1>
      <p className="knowledge-center-subtitle">
        Insights and resources on logistics, e-commerce, and the creator economy.
      </p>
      <div className="articles-grid">
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            <div className="card-content">
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <Link to={`/knowledge-center/${article.id}`} className="button card-button">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KnowledgeCenterPage;

