
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-solenium-lightgreen flex items-center justify-center">
          <span className="text-solenium-green text-4xl font-bold">404</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Página no encontrada</h1>
          <p className="text-gray-600 mb-6">Lo sentimos, la página que buscas no existe.</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-2">
          <Button onClick={() => navigate("/")} className="bg-solenium-blue hover:bg-blue-600">
            Ir al inicio
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
