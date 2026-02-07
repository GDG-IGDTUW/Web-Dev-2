import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Framework =
  | "html"
  | "tailwind"
  | "react"
  | "vue"
  | "angular"
  | "svelte";

interface FrameworkSelectorProps {
  value: Framework;
  onChange: (value: Framework) => void;
  disabled?: boolean;
}

const frameworks = [
  { value: "html", label: "HTML / CSS", description: "Pure HTML with vanilla CSS" },
  { value: "tailwind", label: "Tailwind CSS", description: "HTML with Tailwind utility classes" },
  { value: "react", label: "React", description: "React component with Tailwind" },
  { value: "vue", label: "Vue 3", description: "Vue Single File Component" },
  { value: "angular", label: "Angular", description: "Angular standalone component" },
  { value: "svelte", label: "Svelte", description: "Svelte component" },
];

export const FrameworkSelector = ({ value, onChange, disabled }: FrameworkSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        Select Framework
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full bg-input border-border focus:border-primary focus:ring-primary/20">
          <SelectValue placeholder="Choose a framework" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {frameworks.map((framework) => (
            <SelectItem
              key={framework.value}
              value={framework.value}
              className="focus:bg-secondary cursor-pointer"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{framework.label}</span>
                <span className="text-xs text-muted-foreground">
                  {framework.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
