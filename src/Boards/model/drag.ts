export type DragPiece = "CARD";

export const DragPiecesEnum: Record<DragPiece, DragPiece> = {
  CARD: "CARD",
};

export type DraggedItem = {
  itemId: string;
  originId?: string;
};

export const validateDraggedItem = (item: unknown): item is DraggedItem => {
  return typeof item === "object" && item != null && "itemId" in item;
};
