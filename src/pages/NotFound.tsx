import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, Heart, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-pattern">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary mb-4">404</div>
          <Heart className="h-16 w-16 text-primary-glow mx-auto mb-4 heartbeat" fill="currentColor" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. 
          Let's get you back to saving lives!
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="btn-hero w-full group"
          >
            <Home className="h-5 w-5 mr-3" />
            Return to Home
            <ArrowLeft className="h-5 w-5 ml-2 group-hover:-translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/receivers" 
            className="btn-medical w-full group"
          >
            <Search className="h-5 w-5 mr-3" />
            Find Blood
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Error code: 404</p>
          <p>Requested path: {location.pathname}</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
