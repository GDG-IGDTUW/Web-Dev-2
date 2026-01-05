import { Textarea } from "@/components/ui/textarea";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const examplePrompts = [
  "A modern pricing card with three tiers",
  "A navigation bar with logo and menu items",
  "A hero section with gradient background",
  "A testimonial carousel component",
];

export const PromptInput = ({ value, onChange, disabled }: PromptInputProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        Describe your UI component
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., A modern login form with email and password fields, social login buttons, and a forgot password link..."
        className="min-h-[140px] resize-none bg-input border-border focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground/60 font-sans"
        disabled={disabled}
      />
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground">Try:</span>
        {examplePrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onChange(prompt)}
            disabled={disabled}
            className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
