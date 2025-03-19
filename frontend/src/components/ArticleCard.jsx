import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ id, title, category, readTime, image }) => {
  return (
    <Link to={`/awareness/article/${id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 m-2 rounded-full text-sm">
            {readTime}
          </div>
        </div>
        <div className="p-6">
          <div className="text-sm text-primary mb-2">{category}</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <div className="flex items-center">
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
      </div>
    </Link>
  );
};

export default ArticleCard;