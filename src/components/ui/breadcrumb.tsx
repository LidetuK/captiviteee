import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumb = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <Link to="/" className="flex items-center hover:text-foreground">
        <Home className="h-4 w-4" />
      </Link>
      {paths.map((path, index) => (
        <React.Fragment key={path}>
          <ChevronRight className="h-4 w-4" />
          <Link
            to={`/${paths.slice(0, index + 1).join("/")}`}
            className="capitalize hover:text-foreground"
          >
            {path.replace(/-/g, " ")}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};
