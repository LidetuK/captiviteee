import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";

export default function TempoRoutes() {
  return useRoutes(routes);
}
