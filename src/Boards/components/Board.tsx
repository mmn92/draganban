import {
  Board,
  Card,
  Column,
  addCardToColumn,
  createCard,
} from "../model/core";
import { BoardCard } from "./Card";
import "../styles/style.css";
import { useState } from "react";

export function BoardEntry() {
  const [board, setBoard] = useState<Board>({
    title: "Atividades",
    columns: [
      {
        id: 1,
        title: "TO DO",
        cards: [
          {
            id: 1,
            title: "First Card",
          },
          {
            id: 2,
            title: "Second Card",
            description: "This is the second Card",
          },
          {
            id: 3,
            title: "Third Card",
            description: "Description",
          },
        ],
      },
      {
        id: 2,
        title: "DOING",
        cards: [],
      },
      {
        id: 3,
        title: "DONE",
        cards: [],
      },
    ],
  });

  const handleNewCard = (column: Column, newCard: Card) => {
    const createdCard = createCard(newCard);
    const updatedColumn = addCardToColumn(column, createdCard);

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((c) =>
        c.id === column.id ? updatedColumn : c
      ),
    }));
  };

  return (
    <>
      <header>
        <h1>Boards</h1>
      </header>
      <main>
        <h2>{board.title}</h2>
        <section className="boards-container">
          {board.columns.map((b) => (
            <div key={b.id} className="board-column">
              <div className="column-body">
                <h3 className="board-title">{b.title}</h3>
                <ul className="card-list">
                  {b.cards.map((c) => (
                    <li key={c.id} className="card">
                      <BoardCard card={c} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="column-footer">
                <span
                  className="action"
                  onClick={() => {
                    handleNewCard(b, { title: "New Card" });
                  }}
                >
                  +
                </span>
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
