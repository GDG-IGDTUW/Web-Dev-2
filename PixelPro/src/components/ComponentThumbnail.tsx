import { Star, Trash2 } from "lucide-react";
import { ComponentHistoryItem } from "@/hooks/useComponentHistory";

type Props = {
  item: ComponentHistoryItem;
  onSelect: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
};

export const ComponentThumbnail = ({
  item,
  onSelect,
  onDelete,
  onToggleFavorite,
}: Props) => {
  return (
    <div
      className="border border-border rounded-lg p-3 cursor-pointer hover:bg-muted transition"
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium text-sm truncate">{item.name}</span>
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}>
            <Star
              className={`w-4 h-4 ${
                item.favorite ? "fill-yellow-400 text-yellow-400" : ""
              }`}
            />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <pre className="text-xs bg-background border border-border rounded p-2 overflow-hidden max-h-20">
        {item.code.slice(0, 120)}...
      </pre>
    </div>
  );
};
