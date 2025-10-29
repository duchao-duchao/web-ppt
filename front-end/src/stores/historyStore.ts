import { create } from 'zustand';
import { Command } from '@/types/command';

interface HistoryState {
  undoStack: Command[];
  redoStack: Command[];
  execute: (command: Command) => void;
  undo: () => void;
  redo: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  undoStack: [],
  redoStack: [],

  execute: (command) => {
    command.execute();
    set(state => ({
      undoStack: [...state.undoStack, command],
      redoStack: [], // Clear redo stack on new command
    }));
  },

  undo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length > 0) {
      const command = undoStack[undoStack.length - 1];
      command.undo();
      set({
        undoStack: undoStack.slice(0, -1),
        redoStack: [command, ...redoStack],
      });
    }
  },

  redo: () => {
    const { undoStack, redoStack } = get();
    if (redoStack.length > 0) {
      const command = redoStack[0];
      command.execute();
      set({
        undoStack: [...undoStack, command],
        redoStack: redoStack.slice(1),
      });
    }
  },
}));