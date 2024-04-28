import {
  Board,
  Card,
  Column,
  Persisted,
  addCardToColumn,
  removeCardFromColumn,
} from "../model/core";
import { BoardCard } from "./Card";
import "../styles/style.css";
import { useState } from "react";
// import { BoardKey, LocalStorageRepository } from "../repository/Board";
import { BoardService } from "../services/Board";
import Draggable from "./Draggable";
import Collector from "./Collector";
import { DragPiecesEnum } from "../model/drag";

export function BoardEntry({
  board,
  updateBoard,
}: {
  board: Persisted<Board>;
  updateBoard: (board: Persisted<Board>) => void;
}) {
  // TODO
  // data structure:
  // board -> prop
  // columns -> storage
  // cards -> storage
  // makeBoard(board, columns, cards) -> Board
  // const [columns, setColumns] = useState<Array<Column>>([]);
  // const [cards, setCards] = useState<Array<Card>>([]);
  const [newCardCol, setNewCardCol] = useState("-1");
  const [editting, setEditting] = useState<{
    field: "none" | "title" | "column";
    id: string;
    value: string;
  }>({ field: "none", id: "", value: "" });

  // const boardStorage = LocalStorageRepository<Persisted<Board>>(BoardKey);
  // const cardStorage = LocalStorageRepository<Persisted<Card>>(BoardKey);
  // const columnStorage = LocalStorageRepository<Persisted<Column>>(BoardKey);
  const boardService = BoardService();

  // new card:
  // service.createNewCard -> addCardToColumn -> updateBoard -> repository.save
  const handleNewCard = (column: Column, newCard: Card) => {
    const createdCard = boardService.createNewCard(newCard);
    const updatedColumn = addCardToColumn(column, createdCard);
    const updatedBoard = {
      ...board,
      columns: board.columns.map((c) =>
        c.id === column.id ? updatedColumn : c
      ),
    };

    updateBoard(updatedBoard);

    // boardStorage.save(updatedBoard);
  };

  const handleNewColumn = (column: Column) => {
    const createdColumn = boardService.createNewColumn(column);
    const updatedBoard = {
      ...board,
      columns: [...board.columns, createdColumn],
    };

    updateBoard(updatedBoard);

    // boardStorage.save(updatedBoard);
  };

  const handleEditTitle = (title: string) => {
    if (!title) return;

    const updatedBoard = {
      ...board,
      title,
    };

    updateBoard(updatedBoard);
    // boardStorage.save(updatedBoard);
  };

  const handleEditColumnTitle = (columnId: string, title: string) => {
    if (!title || !columnId) return;

    const updatedBoard = {
      ...board,
      columns: board.columns.map((c) =>
        c.id === columnId ? { ...c, title } : c
      ),
    };

    updateBoard(updatedBoard);
    // boardStorage.save(updatedBoard);
  };

  const dragCard = (cardId: string, from: string, to: string) => {
    if (from === to) return;

    const fromCol = board.columns.filter((c) => c.id === from)[0];
    const toCol = board.columns.filter((c) => c.id === to)[0];

    if (!fromCol || !toCol) return;

    const card = fromCol.cards.filter((c) => c.id === cardId)[0];

    if (!card) return;

    const updatedFromCol = removeCardFromColumn(fromCol, card);
    const updatedToCol = addCardToColumn(toCol, card);

    const updatedBoard = {
      ...board,
      columns: board.columns.map((c) =>
        c.id === updatedFromCol.id
          ? updatedFromCol
          : c.id === updatedToCol.id
          ? updatedToCol
          : c
      ),
    };

    updateBoard(updatedBoard);
  };

  const moveCard = (card: Card, from: number, to: number) => {
    if (from < 0 || to < 0) return;
    const fromCol = board.columns[from];
    const toCol = board.columns[to];

    const updatedFromCol = removeCardFromColumn(fromCol, card);
    const updatedToCol = addCardToColumn(toCol, card);

    const updatedBoard = {
      ...board,
      columns: board.columns.map((c) =>
        c.id === updatedFromCol.id
          ? updatedFromCol
          : c.id === updatedToCol.id
          ? updatedToCol
          : c
      ),
    };

    updateBoard(updatedBoard);
  };

  return (
    <>
      <header>
        <h1>Board</h1>
      </header>
      <main>
        <section
          style={{
            display: "flex",
            alignItems: "center",
          }}
          className="board-title"
        >
          {editting.field === "title" ? (
            <div className="edit-input">
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const formData = new FormData(e.target as HTMLFormElement);
                  const title = formData.get("title");
                  if (title) {
                    handleEditTitle(String(title));
                  }

                  setEditting({ field: "none", id: "", value: "" });
                }}
              >
                <input
                  autoFocus
                  type="text"
                  name="title"
                  defaultValue={board.title}
                />
                <button type="submit" className="clear">
                  ✅
                </button>
              </form>
            </div>
          ) : (
            <div className="edittable-title hover-show">
              <h2>{board.title}</h2>
              <button
                className="clear hover-action"
                onClick={() => {
                  setEditting({ field: "title", id: "", value: "" });
                }}
              >
                ✏️
              </button>
            </div>
          )}
        </section>
        <section className="boards-container">
          {board.columns.length > 0 ? (
            board.columns.map((col, index, arr) => (
              <Collector
                acceptType={DragPiecesEnum.CARD}
                onDrop={(item) => {
                  dragCard(item.itemId, item.originId || "", col.id || "");
                }}
                key={col.id}
              >
                <div className="board-column">
                  <div className="column-body">
                    <h3
                      style={{ display: "flex", alignItems: "center" }}
                      className="board-title"
                    >
                      {editting.field === "column" && editting.id === col.id ? (
                        <>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();

                              const formData = new FormData(
                                e.target as HTMLFormElement
                              );
                              const title = formData.get("title");
                              if (title) {
                                handleEditColumnTitle(
                                  editting.id,
                                  String(title)
                                );
                              }

                              setEditting({ field: "none", id: "", value: "" });
                            }}
                          >
                            <input
                              autoFocus
                              type="text"
                              defaultValue={col.title}
                              name="title"
                            />
                            <button className="clear" type="submit">
                              ✅
                            </button>
                          </form>
                        </>
                      ) : (
                        <div className="edittable-title hover-show">
                          <h2>{col.title}</h2>
                          <button
                            className="clear hover-action"
                            onClick={() => {
                              setEditting({
                                field: "column",
                                id: col.id || "",
                                value: "",
                              });
                            }}
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </h3>
                    <ul className="card-list">
                      {col.cards.map((c) => (
                        <li key={c.id} className="card">
                          <Draggable
                            item={c}
                            originId={col.id}
                            itemType={DragPiecesEnum.CARD}
                          >
                            <BoardCard
                              card={c}
                              canPrevious={index > 0}
                              handlePrevious={() => {
                                moveCard(c, index, index - 1);
                              }}
                              canNext={index + 1 < arr.length}
                              handleNext={() => {
                                moveCard(c, index, index + 1);
                              }}
                            />
                          </Draggable>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="column-footer">
                    {newCardCol === col.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();

                          const formData = new FormData(
                            e.target as HTMLFormElement
                          );
                          const title = formData.get("title");
                          if (title) {
                            handleNewCard(col, { title: String(title) });
                          }

                          setNewCardCol("-1");
                        }}
                      >
                        <input
                          autoFocus
                          type="text"
                          name="title"
                          placeholder="new card title"
                        />
                      </form>
                    ) : (
                      <span
                        className="action"
                        onClick={() => {
                          setNewCardCol(col.id || "-1");
                        }}
                      >
                        ➕
                      </span>
                    )}
                  </div>
                </div>
              </Collector>
            ))
          ) : (
            <h2>No columns yet</h2>
          )}
        </section>
        <section className="column-action">
          <button
            className="pointer app-btn"
            onClick={() => {
              handleNewColumn({
                title: "New Column",
                cards: [],
              });
            }}
          >
            New Column
          </button>
        </section>
      </main>
    </>
  );
}
