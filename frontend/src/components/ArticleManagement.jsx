import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ArticleForm from './ArticleForm';

const ArticleManagement = () => {
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/articles');
      const articlesData = response.data.map(doc => ({
        id: doc._id,
        ...doc
      }));
      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleSubmit = async (article) => {
    try {
      if (editingArticle) {
        await api.put(`/articles/${editingArticle.id}`, article);
      } else {
        await api.post('/articles', article);
      }
      fetchArticles();
      setEditingArticle(null);
    } catch (error) {
      console.error('Error submitting article:', error);
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/articles/${id}`);
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Article Management</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <ArticleForm onSubmit={handleArticleSubmit} article={editingArticle} />
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Existing Articles</h2>
        {loading ? (
          <div className="text-center">Loading articles...</div>
        ) : articles && articles.length > 0 ? (
          <ul>
            {articles.map((article) => (
              <li key={article.id} className="mb-4 p-4 border rounded">
                <h3 className="text-lg font-bold">{article.title}</h3>
                <p>{article.Description}</p>
                <p className="text-sm text-gray-600">Category ID: {article.categoryId}</p>
                <button
                  onClick={() => handleEdit(article)}
                  className="mr-2 bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default ArticleManagement;