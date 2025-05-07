import React from "react";
import { Link } from "react-router-dom";

const SimpleNavbar = () => (
  <nav style={{
    display: "flex",
    gap: "1.5rem",
    padding: "1rem 2rem",
    background: "#f8f9fa",
    borderBottom: "1px solid #eee"
  }}>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
    <Link to="/features">Features</Link>
    <Link to="/pricing">Pricing</Link>
    <Link to="/blog">Blog</Link>
    <Link to="/contact">Contact</Link>
    <Link to="/docs">Docs</Link>
    <Link to="/help">Help</Link>
    <Link to="/api-docs">API Docs</Link>
    <Link to="/privacy">Privacy</Link>
    <Link to="/login" style={{marginLeft: "auto"}}>Login</Link>
  </nav>
);

export default SimpleNavbar; 