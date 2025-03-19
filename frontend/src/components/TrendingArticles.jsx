import React from 'react';
import { Link } from 'react-router-dom';

const TrendingArticles = ({ articles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link
          key={article.id}
          to={`/awareness/article/${article.id}`}
          className="group"
        >
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 m-2 rounded-full text-sm">
                {article.readTime}
              </div>
            </div>
            <div className="p-6">
              <div className="text-sm text-primary mb-2">{article.category}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors duration-300">
                {article.title}
              </h3>
              <div className="flex items-center text-gray-500 text-sm">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Read More
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TrendingArticles;