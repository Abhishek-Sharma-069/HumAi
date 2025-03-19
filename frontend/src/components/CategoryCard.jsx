import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ id, title, icon }) => {
  return (
    <Link
      to={`/awareness/category/${id}`}
      className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center group"
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
    </Link>
  );
};

export default CategoryCard;