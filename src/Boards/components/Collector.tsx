import React, { ReactNode } from "react";
import { useDrop } from "react-dnd";
import { DragPiece, DraggedItem, validateDraggedItem } from "../model/drag";

type CollectorProps = {
  acceptType: DragPiece;
  onDrop: (dropped: DraggedItem) => void;
  children: ReactNode;
};

export default function Collector({
  acceptType,
  onDrop,
  children,
}: CollectorProps) {
  const [{ hovering }, drop] = useDrop(
    () => ({
      accept: acceptType,
      drop: (dropped) => {
        if (validateDraggedItem(dropped)) {
          onDrop(dropped);
        }
      },
      collect: (monitor) => {
        return {
          hovering: !!monitor.isOver(),
        };
      },
    }),
    []
  );

  return (
    <div
      ref={drop}
      style={{
        border: hovering ? "2px solid red" : "2px solid transparent",
        width: "fit-content",
        height: "fit-content",
      }}
    >
      {children}
    </div>
  );
}
