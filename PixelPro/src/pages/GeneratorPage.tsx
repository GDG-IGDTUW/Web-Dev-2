/**
 * GeneratorPage.tsx
 *
 * The main UI component generator page.
 * Users can enter prompts, select frameworks, and generate code.
 *
 * Mobile-first responsive layout (Issue #35):
 * - Single-column stack on xs/sm (< 640px)
 * - Two-column grid for FrameworkSelector + Generate button on sm+
 * - Touch targets min 44×44px across all interactive elements
 * - No horizontal scrolling at any viewport width
 *
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
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";

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

  const handleClear = () => {
    setPrompt("");
    setGeneratedCode(null);
    toast.info("Cleared");
  };

  useKeyboardShortcuts({
    onGenerate: handleGenerate,
    onCopy: () => {}, // handled in CodePreview
    onClear: handleClear,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back navigation */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Back to landing page */}
              <Link to="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-[44px] min-w-[44px]"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  PixelPro
                </span>
              </div>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground hidden xs:block">
              UI Component Generator
            </span>
          </div>
        </div>
      </header>

      {/* Main Generator Section */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page title */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
              Generate UI Components
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Describe your component and choose a framework
            </p>
          </div>

          {/* Generator Card */}
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
            {/* Input Section — single column on mobile, 2-col grid on sm+ */}
            <div className="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Prompt input — always full width */}
              <div>
                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  disabled={isLoading}
                />
                {/* Undo / Redo actions */}
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={undo}
                    disabled={!canUndo || isLoading}
                    className="min-h-[44px] px-4"
                  >
                    Undo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={redo}
                    disabled={!canRedo || isLoading}
                    className="min-h-[44px] px-4"
                  >
                    Redo
                  </Button>
                </div>
              </div>

              {/* Framework selector + Generate button — stack on xs, side-by-side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FrameworkSelector
                  value={framework}
                  onChange={setFramework}
                  disabled={isLoading}
                />

                <div className="flex items-end">
                  <Button
                    variant="generate"
                    size="lg"
                    className="w-full min-h-[44px]"
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                  >
                    <Sparkles className="w-5 h-5" />
                    {isLoading ? "Generating..." : "Generate Component"}
                    <span className="ml-2 text-xs opacity-70 hidden sm:inline">
                      (Ctrl + Enter)
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="border-t border-border pt-4 sm:pt-6">
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
                <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-muted flex items-center justify-center mb-3 sm:mb-4">
                    <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs sm:max-w-sm">
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
      <footer className="border-t border-border py-4 sm:py-6 mt-6 sm:mt-8">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
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
