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
            <input
              autoFocus
              type="text"
              defaultValue={board.title}
              value={editting.value}
              onChange={(e) => {
                setEditting((p) => ({ ...p, value: e.target.value }));
              }}
            />
          ) : (
            <h2>{board.title}</h2>
          )}
          <button
            style={{
              background: "none",
              border: "none",
              outline: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              if (editting.field === "none") {
                setEditting({ field: "title", id: "", value: "" });
              }
              if (editting.field === "title") {
                handleEditTitle(editting.value);
                setEditting({ field: "none", id: "", value: "" });
              }
            }}
          >
            {editting.field === "title" ? "✅" : "✏️"}
          </button>
        </section>
        <section className="boards-container">
          {board.columns.length > 0 ? (
            board.columns.map((col, index, arr) => (
              <div key={col.id} className="board-column">
                <div className="column-body">
                  <h3
                    style={{ display: "flex", alignItems: "center" }}
                    className="board-title"
                  >
                    {editting.field === "column" && editting.id === col.id ? (
                      <input
                        autoFocus
                        type="text"
                        defaultValue={col.title}
                        value={editting.value}
                        onChange={(e) => {
                          setEditting((p) => ({ ...p, value: e.target.value }));
                        }}
                      />
                    ) : (
                      <h2>{col.title}</h2>
                    )}
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (editting.field === "none") {
                          setEditting({
                            field: "column",
                            id: col.id || "",
                            value: "",
                          });
                        }
                        if (
                          editting.field === "column" &&
                          editting.id === col.id
                        ) {
                          handleEditColumnTitle(editting.id, editting.value);
                          setEditting({ field: "none", id: "", value: "" });
                        }
                      }}
                    >
                      {editting.field === "column" && editting.id === col.id
                        ? "✅"
                        : "✏️"}
                    </button>
                  </h3>
                  <ul className="card-list">
                    {col.cards.map((c) => (
                      <li key={c.id} className="card">
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
            ))
          ) : (
            <h2>No columns yet</h2>
          )}
        </section>
        <section className="column-action">
          <button
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
