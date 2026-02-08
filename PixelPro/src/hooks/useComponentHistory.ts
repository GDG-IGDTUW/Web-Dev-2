import { useLocalStorage } from "./useLocalStorage";
import { Framework } from "@/components/FrameworkSelector";

export type ComponentHistoryItem = {
  id: string;
  name: string;
  prompt: string;
  framework: Framework;
  code: string;
  favorite: boolean;
  createdAt: number;
};

export function useComponentHistory() {
  const [history, setHistory] = useLocalStorage<ComponentHistoryItem[]>(
    "pixelpro-component-history",
    []
  );

  const addComponent = (item: Omit<ComponentHistoryItem, "id" | "createdAt">) => {
    setHistory((prev) => [
      {
        ...item,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const removeComponent = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const renameComponent = (id: string, name: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, name } : item
      )
    );
  };

  const toggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  return {
    history,
    addComponent,
    removeComponent,
    renameComponent,
    toggleFavorite,
  };
}
