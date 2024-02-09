// Board -> Columns -> Cards

export type Card = {
  id?: number;
  title: string;
  description?: string;
};

export type Column = {
  id?: number;
  title: string;
  cards: Array<Card>; // -> Array or Obj???
};

export type Board = {
  title: string;
  columns: Array<Column>; // -> Array or Obj???
};

////////////////////////////////////////////////////////////////////////////

export type CreateCard = (card: Card) => Card;
export type AddCardToColumn = (column: Column, card: Card) => Column;
export type RemoveCardFromColumn = (column: Column, card: Card) => Column;
export type EditCard = (card: Card, newCard: Partial<Card>) => Card;
// ??? export type MoveCard = compose(AddCardToColumn, RemoveCardFromColumn) ???

export type CreateColumn = (column: Column) => Column;
export type AddColumnToBoard = (board: Board, column: Column) => Board;
export type RemoveColumnFromBoard = (board: Board, column: Column) => Board;
export type EditColumn = (column: Column, newColumn: Partial<Column>) => Column;

export type CreateBoard = (board: Board, columns?: Array<Column>) => Board;
export type EditBoard = (board: Board, newBoard: Partial<Board>) => Board;
//      ^MoveColumn ???

////////////////////////////////////////////////////////////////////////////
//  Implementation
////////////////////////////////////////////////////////////////////////////
export const createCard: CreateCard = (card) => ({
  id: card.id ?? -1,
  title: card.title,
  description: card.description ?? "",
});

export const addCardToColumn: AddCardToColumn = (column, card) => ({
  ...column,
  cards: [card, ...column.cards],
});

export const removeCardFromColumn: RemoveCardFromColumn = (column, card) => {
  if (card.id == null) return column;

  return {
    ...column,
    cards: column.cards.filter((c) => c.id !== card.id),
  };
};

export const editCard: EditCard = (card, newCard) => ({
  ...card,
  ...newCard,
});

export const createColumn: CreateColumn = (column) => ({
  id: column.id ?? -1,
  title: column.title,
  cards: [],
});

export const addColumnToBoard: AddColumnToBoard = (board, column) => ({
  ...board,
  columns: [column, ...board.columns],
});

export const removeColumnFromBoard: RemoveColumnFromBoard = (board, column) => {
  if (column.id == null) return board;

  return {
    ...board,
    columns: board.columns.filter((c) => c.id !== column.id),
  };
};

export const editColumn: EditColumn = (column, newColumn) => ({
  ...column,
  ...newColumn,
});

export const createBoard: CreateBoard = (board, columns = []) => ({
  title: board.title,
  columns,
});

export const editBoard: EditBoard = (board, newBoard) => ({
  ...board,
  ...newBoard,
});
