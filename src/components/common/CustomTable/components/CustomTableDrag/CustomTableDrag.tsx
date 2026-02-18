import { useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { CustomTableI } from "../../interface/CustomTable.interface";

function areColumnsEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  return a.every((id, i) => id === b[i]);
}

function CustomTableDrag<TData>({
  table,
  children,
  columnOrder = [],
  onColumnOrderChange,
}: CustomTableI<TData> & { children: React.ReactNode }) {
  const onChangeRef = useRef(onColumnOrderChange);
  onChangeRef.current = onColumnOrderChange;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && onChangeRef.current) {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
        onChangeRef.current(newOrder);
      }
    }
  };

  // Initialize column order on first mount when empty
  const initializedRef = useRef(false);
  useEffect(() => {
    if (initializedRef.current) return;
    if (!table || columnOrder.length > 0) return;

    const columnIds = table.getAllColumns().map((col) => col.id);
    if (columnIds.length > 0) {
      initializedRef.current = true;
      onChangeRef.current?.(columnIds);
    }
  }, [table, columnOrder.length]);

  // Sync column order when columns are added/removed
  useEffect(() => {
    if (!table || columnOrder.length === 0) return;

    const currentIds = table.getAllColumns().map((col) => col.id);
    const hasNew = currentIds.some((id) => !columnOrder.includes(id));
    const hasRemoved = columnOrder.some((id) => !currentIds.includes(id));

    if (!hasNew && !hasRemoved) return;

    const kept = columnOrder.filter((id) => currentIds.includes(id));
    const added = currentIds.filter((id) => !columnOrder.includes(id));
    const finalOrder = [...kept, ...added];

    if (!areColumnsEqual(finalOrder, columnOrder)) {
      onChangeRef.current?.(finalOrder);
    }
  }, [table, columnOrder]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      {children}
      <DragOverlay
        style={{
          zIndex: 1000,
          pointerEvents: 'none',
        }}
      >
        
      </DragOverlay>
    </DndContext>
  );
}

export default CustomTableDrag;
