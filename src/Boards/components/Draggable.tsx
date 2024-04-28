import { ReactNode } from "react";
import { useDrag } from "react-dnd";
import { DragPiece } from "../model/drag";

type DraggableProps = {
  item: { id?: string };
  originId?: string;
  itemType: DragPiece;
  children: ReactNode;
};

export default function Draggable({
  item,
  originId,
  itemType,
  children,
}: DraggableProps) {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: itemType,
      item: { itemId: item.id, originId },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    []
  );

  return (
    <div ref={dragRef} style={{ opacity }}>
      {children}
    </div>
  );
}
