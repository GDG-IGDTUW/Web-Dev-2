/**
 * NotFound.tsx
 * 
 * 404 error page displayed when users navigate to non-existent routes.
 * Provides a friendly message and navigation back to the home page.
 */

import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  // Log 404 errors for debugging
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PixelPro</span>
          </Link>
        </div>
      </header>

      {/* 404 Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Large 404 */}
          <div className="relative mb-8">
            <h1 className="text-9xl font-bold text-muted/20">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <Code2 className="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-muted-foreground/60 mb-8">
            Route: <code className="px-2 py-1 rounded bg-muted">{location.pathname}</code>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button variant="default" size="lg" className="gap-2">
                <Home className="w-5 h-5" />
                Go Home
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link to="/generate" className="text-primary hover:underline">
                Try the generator
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for the open-source community • PixelPro v1.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
