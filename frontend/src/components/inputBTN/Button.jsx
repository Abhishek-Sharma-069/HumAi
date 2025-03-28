import React from 'react';

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`btn-primary whitespace-nowrap ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
