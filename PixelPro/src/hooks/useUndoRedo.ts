import { useState } from "react";

export function useUndoRedo<T>(initialValue: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initialValue);
  const [future, setFuture] = useState<T[]>([]);

  // Set a new value (push current into past)
  const set = (value: T) => {
    if (value === present) return;

    setPast((prev) => [...prev, present]);
    setPresent(value);
    setFuture([]);
  };

  // Undo: move one step back
  const undo = () => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;

      const previous = prevPast[prevPast.length - 1];
      setFuture((prevFuture) => [present, ...prevFuture]);
      setPresent(previous);

      return prevPast.slice(0, prevPast.length - 1);
    });
  };

  // Redo: move one step forward
  const redo = () => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;

      const next = prevFuture[0];
      setPast((prevPast) => [...prevPast, present]);
      setPresent(next);

      return prevFuture.slice(1);
    });
  };

  return {
    value: present,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
