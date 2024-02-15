import { v4 as uuidv4 } from "uuid";
import {
  CreateBoard,
  CreateCard,
  CreateColumn,
  Persisted,
  PersistedFn,
  createBoard,
  createCard,
  createColumn,
} from "../model/core";

function checkPersisted<T extends { id?: string }>(
  obj: T
): obj is Persisted<T> {
  return obj.id != null && obj.id !== "";
}

export function BoardService() {
  const createNewCard: PersistedFn<CreateCard> = (card) => {
    const newId = uuidv4();

    const created = createCard({ ...card, id: newId });
    if (!checkPersisted(created)) {
      throw new Error("It was not possible to create this item");
    }

    return created;
  };

  const createNewColumn: PersistedFn<CreateColumn> = (column) => {
    const newId = uuidv4();

    const created = createColumn({ ...column, id: newId });
    if (!checkPersisted(created)) {
      throw new Error("It was not possible to create this item");
    }

    return created;
  };

  const createNewBoard: PersistedFn<CreateBoard> = (board, columns) => {
    const newId = uuidv4();

    const created = createBoard({ ...board, id: newId }, columns);
    if (!checkPersisted(created)) {
      throw new Error("It was not possible to create this item");
    }

    return created;
  };

  return {
    createNewCard,
    createNewColumn,
    createNewBoard,
  };
}
