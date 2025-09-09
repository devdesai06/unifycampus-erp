import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { BookOpen, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
      <Card className="w-full max-w-md text-center card-hover shadow-lg">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link to="/" className="block">
              <Button variant="hero" className="w-full" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()} 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
