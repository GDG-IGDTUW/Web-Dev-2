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

interface CodePreviewProps {
  code: string;
  framework: string;
}

export const CodePreview = ({ code, framework }: CodePreviewProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
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

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Generated Code</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {getLanguageLabel()}
          </span>
        </div>
        
        {/* [2] Grouped Actions: Copy and Export */}
        <div className="flex items-center gap-2">
          <ExportDropdown code={code} framework={framework} /> {/* Added framework prop here */}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-success" />
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
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
          <pre className="p-4 overflow-x-auto code-scrollbar max-h-[400px]">
  <code
    className={`language-${getPrismLanguage()} text-sm font-mono leading-relaxed`}
    dangerouslySetInnerHTML={{
      __html: Prism.highlight(
        code,
        Prism.languages[getPrismLanguage()],
        getPrismLanguage()
      ),
    }}
  />
</pre>
        </div>
      </div>
    </div>
  );
};
