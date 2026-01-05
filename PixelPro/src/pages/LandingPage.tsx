/**
 * LandingPage.tsx
 * 
 * The main landing page for PixelPro.
 * Simple, clean introduction with a CTA to the generator.
 * 
 * TODO: Add testimonials section
 * TODO: Add feature showcase
 * TODO: Add footer with social links
 */

import { Link } from "react-router-dom";
import { Sparkles, Code2, Zap, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PixelPro</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                AI-Powered Generation
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              AI-Powered UI
              <br />
              <span className="text-primary">Component Generator</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Describe your component, choose your framework, and let AI create
              clean, reusable code in seconds. Perfect for rapid prototyping.
            </p>

            {/* CTA Button */}
            <Link to="/generate">
              <Button variant="generate" size="lg" className="text-lg px-8 py-6">
                <Sparkles className="w-5 h-5" />
                Generate UI
              </Button>
            </Link>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-16">
              {[
                { icon: Zap, text: "Instant Generation" },
                { icon: Code2, text: "Clean Code" },
                { icon: Layers, text: "Multiple Frameworks" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
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

export default LandingPage;
