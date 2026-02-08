/**
 * GeneratorPage.tsx
 * 
 * The main UI component generator page.
 * Users can enter prompts, select frameworks, and generate code.
 * 
 * TODO: Add syntax highlighting with Prism.js
 * TODO: Add history sidebar
 * TODO: Add live preview panel
 * TODO: Integrate real AI (Gemini) instead of mock
 */

import { useState } from "react";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { Link } from "react-router-dom";
import { Sparkles, Code2, ArrowLeft } from "lucide-react";
import { PromptInput } from "@/components/PromptInput";
import { FrameworkSelector, Framework } from "@/components/FrameworkSelector";
import { CodePreview } from "@/components/CodePreview";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { generateCode } from "@/services/mockAI";
import { toast } from "sonner";
import { MultiFrameworkPreview } from "@/components/MultiFrameworkPreview";
import { HistorySidebar } from "@/components/HistorySidebar";
import { useComponentHistory } from "@/hooks/useComponentHistory";

const GeneratorPage = () => {
  // State for the prompt input
  const {
  value: prompt,
  set: setPrompt,
  undo,
  redo,
  canUndo,
  canRedo,
} = useUndoRedo("");
  
  // State for selected framework
  const [framework, setFramework] = useState<Framework>("react");
  
  // State for generated code output
  const [generatedCode, setGeneratedCode] =
  useState<Record<Framework, string> | null>(null);
  const { addComponent } = useComponentHistory();
  
  // Loading state while generating
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the generate button click.
   * Calls the mock AI service to generate code.
   * 
   * TODO: Replace with actual API call to /api/generate
   */
  const handleGenerate = async () => {
    // Validate prompt is not empty
    if (!prompt.trim()) {
      toast.error("Please enter a description for your component");
      return;
    }
    setPrompt(prompt);
    setIsLoading(true);
    setGeneratedCode(null);

    try {
      // Call the mock AI service (will be replaced with real API)
      const result = await generateCode(prompt);
      setGeneratedCode(result);
      addComponent({
        name: "Generated Component",
        prompt,
        framework,
        code: result[framework],
        favorite: false,
    });

      toast.success("Component generated successfully!");
    } catch (error) {
      toast.error("Failed to generate component. Please try again.");
      console.error("Generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back navigation */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back to landing page */}
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">PixelPro</span>
              </div>
            </div>
            <span className="text-sm text-muted-foreground hidden sm:block">
              UI Component Generator
            </span>
          </div>
        </div>
      </header>

      {/* Main Generator Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Generate UI Components
            </h1>
            <p className="text-muted-foreground">
              Describe your component and choose a framework
            </p>
          </div>

          {/* Generator Card */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
            {/* Input Section */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              {/* Prompt input spans full width */}
              <div className="md:col-span-2">
                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  disabled={isLoading}
                />
                <div className="flex gap-2 mt-2">
  <Button
    variant="outline"
    size="sm"
    onClick={undo}
    disabled={!canUndo || isLoading}
  >
    Undo
  </Button>

  <Button
    variant="outline"
    size="sm"
    onClick={redo}
    disabled={!canRedo || isLoading}
  >
    Redo
  </Button>
</div>
              </div>
              
              {/* Framework selector */}
              <FrameworkSelector
                value={framework}
                onChange={setFramework}
                disabled={isLoading}
              />
              
              {/* Generate button */}
              <div className="flex items-end">
                <Button
                  variant="generate"
                  size="lg"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                >
                  <Sparkles className="w-5 h-5" />
                  {isLoading ? "Generating..." : "Generate Component"}
                </Button>
              </div>
            </div>

            {/* Output Section */}
            <div className="border-t border-border pt-6">
              {isLoading ? (
                // Show loader while generating
                <Loader />
              ) : generatedCode ? (
                // Show code preview when code is generated
               <CodePreview
  code={generatedCode[framework]}
  framework={framework}
/>
              ) : (
                // Empty state
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Code2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Enter a description above and click generate to create your
                    custom UI component.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for the open-source community • PixelPro v1.0
          </p>
        </div>
      </footer>
      {/* History Sidebar */}
      <HistorySidebar
        onSelectComponent={(code) =>
          setGeneratedCode({ ...generatedCode!, [framework]: code })
        }
      />
    </div>
  );
};

export default GeneratorPage;
