import { Routes, Route, useRoutes } from "react-router-dom";
import routes from "tempo-routes";

export default function TempoRoutes() {
  // Use the tempo-routes for dynamic storyboard routing
  const tempoRoutes = useRoutes(routes);

  return (
    <>
      {/* Render the tempo routes */}
      {tempoRoutes}

      {/* Fallback route for direct tempobook access */}
      <Routes>
        <Route path="/tempobook/*" element={<></>} />
      </Routes>
    </>
  );
}
