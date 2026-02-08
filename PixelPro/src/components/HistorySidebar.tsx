import { useState } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { ComponentThumbnail } from "./ComponentThumbnail";
import { useComponentHistory } from "@/hooks/useComponentHistory";

type Props = {
  onSelectComponent: (code: string) => void;
};

export const HistorySidebar = ({ onSelectComponent }: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const {
    history,
    removeComponent,
    toggleFavorite,
  } = useComponentHistory();

  const filtered = history.filter(
    (item) =>
      item.prompt.toLowerCase().includes(query.toLowerCase()) ||
      item.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-border shadow-lg
      transform transition-transform duration-300 z-40
      ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      <button
        className="absolute -left-10 top-20 bg-card border border-border rounded-l-lg p-2"
        onClick={() => setOpen(!open)}
      >
        <ChevronLeft className={`w-5 h-5 transition ${open ? "rotate-180" : ""}`} />
      </button>

      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            className="w-full bg-background border border-border rounded px-2 py-1 text-sm"
            placeholder="Search history..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto h-full">
        {filtered.map((item) => (
          <ComponentThumbnail
            key={item.id}
            item={item}
            onSelect={() => onSelectComponent(item.code)}
            onDelete={() => removeComponent(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        ))}
      </div>
    </div>
  );
};
