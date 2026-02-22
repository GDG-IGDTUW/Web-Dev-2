import { useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import { Check, Copy, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ExportDropdown }  from "./ExportDropdown"; // [1] Import the new component
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";

interface CodePreviewProps {
  code: string;
  framework: string;
}

export const CodePreview = ({ code, framework }: CodePreviewProps) => {
  const [copied, setCopied] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());

  const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(code);

    setCopied(true);
    setShowCopied(true);
    toast.success("Code copied to clipboard!");

    // Fade out after a short duration
    setTimeout(() => {
      setShowCopied(false);
      setCopied(false);
    }, 1500);
  } catch (err) {
    toast.error("Failed to copy code");
  }
};

  const handleCopySelectedLines = async () => {
  if (selectedLines.size === 0) {
    toast.error("No lines selected");
    return;
  }

  const selectedCode = Array.from(selectedLines)
    .sort((a, b) => a - b)
    .map(i => codeLines[i])
    .join("\n");

  try {
    await navigator.clipboard.writeText(selectedCode);
    toast.success("Selected lines copied!");
  } catch {
    toast.error("Failed to copy selected lines");
  }
};

  const clearSelection = () => {
  setSelectedLines(new Set());
};


  const getLanguageLabel = () => {
    switch (framework) {
      case "html": return "HTML / CSS";
      case "tailwind": return "HTML + Tailwind";
      case "react": return "React + Tailwind";
      default: return "Code";
    }
  };

  const getPrismLanguage = () => {
  switch (framework) {
    case "html":
      return "markup";
    case "tailwind":
      return "markup";
    case "react":
      return "tsx";
    default:
      return "markup";
  }
};

  const codeLines = code.split("\n");
const toggleLineSelection = (lineNumber: number) => {
  setSelectedLines(prev => {
    const updated = new Set(prev);
    if (updated.has(lineNumber)) {
      updated.delete(lineNumber);
    } else {
      updated.add(lineNumber);
    }
    return updated;
  });
};

  useKeyboardShortcuts({
  onGenerate: () => {},
  onCopy: handleCopy,
  onClear: clearSelection,
});

  return (
    <div className="animate-fade-in-up">
      {/* Header: stacks vertically on mobile, side-by-side on sm+ */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Generated Code</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {getLanguageLabel()}
          </span>
        </div>
        
        {/* [2] Grouped Actions: Copy and Export */}
        <div className="flex flex-wrap items-center gap-2">
          <ExportDropdown code={code} framework={framework} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySelectedLines}
            disabled={selectedLines.size === 0}
            className="min-h-[44px] px-3"
          >
            Copy Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2 min-h-[44px] px-3"
          >
            <>
              {copied ? (
                <span
                  className={`
                    flex items-center gap-2 text-success
                    transition-opacity duration-300
                    ${showCopied ? "opacity-100" : "opacity-0"}
                  `}
                >
                  <Check className="w-4 h-4" />
                  Copied!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                  <span className="text-xs opacity-60 hidden sm:inline">(Ctrl + C)</span>
                </span>
              )}
            </>
          </Button>
        </div>
      </div>
      
      <div className="relative rounded-lg border border-code-border bg-code overflow-hidden">
        {/* Code editor header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-success/60" />
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            component.{framework === "react" ? "tsx" : "html"}
          </span>
        </div>
        
        <div className="relative">
          <pre className="p-3 sm:p-4 overflow-x-auto code-scrollbar max-h-[280px] sm:max-h-[400px]">
  <code className={`language-${getPrismLanguage()} text-sm font-mono`}>
  {codeLines.map((line, index) => {
    const highlighted = Prism.highlight(
      line || " ",
      Prism.languages[getPrismLanguage()],
      getPrismLanguage()
    );

    const isSelected = selectedLines.has(index);

    return (
      <div
        key={index}
        onClick={() => toggleLineSelection(index)}
        className={`flex cursor-pointer px-2 rounded
          ${isSelected ? "bg-primary/20" : "hover:bg-secondary/40"}
        `}
      >
        <span className="select-none w-10 text-right pr-4 text-muted-foreground">
          {index + 1}
        </span>
        <span
          dangerouslySetInnerHTML={{ __html: highlighted || "&nbsp;" }}
        />
      </div>
    );
  })}
</code>

</pre>
        </div>
      </div>
    </div>
  );
};
