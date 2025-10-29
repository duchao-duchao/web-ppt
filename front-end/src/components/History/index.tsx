import { usePresentationStore } from "@/stores/presentationStore";
import { UndoOutlined, RedoOutlined } from "@ant-design/icons";

export default function History() {
  const undo = usePresentationStore.temporal.getState().undo;
  const redo = usePresentationStore.temporal.getState().redo;
  const futureStates = usePresentationStore.temporal.getState().futureStates;
  const pastStates = usePresentationStore.temporal.getState().pastStates;

  return (
    <div className="history">
      <button
        className="history-btn"
        disabled={!pastStates?.length}
        onClick={() => undo()}
      >
        <UndoOutlined />
      </button>
      <button
        className="history-btn"
        disabled={!futureStates.length}
        onClick={() => redo()}
      >
        <RedoOutlined />
      </button>
    </div>
  );
}