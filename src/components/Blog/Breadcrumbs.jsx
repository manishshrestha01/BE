import { Fragment } from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items, onNavigate }) => (
  <nav className="blog-breadcrumb" aria-label="Breadcrumb">
    {items.map((item, index) => {
      const isLast = index === items.length - 1;

      return (
        <Fragment key={`${item.label}-${index}`}>
          {item.to && !isLast ? (
            <Link to={item.to} onClick={onNavigate}>
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          {!isLast ? <span>/</span> : null}
        </Fragment>
      );
    })}
  </nav>
);

export default Breadcrumbs;
