import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ paths }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {paths.map((path, index) => (
          <li
            key={index}
            className={`breadcrumb-item ${index === paths.length - 1 ? 'active' : ''}`}
          >
            {index === paths.length - 1 ? (
              path.name
            ) : (
              <Link to={path.link}>{path.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
