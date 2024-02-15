import { useState } from "react";
import { BoardEntry } from "../components/Board";
import { Board, Persisted } from "../model/core";
import { BoardKey, LocalStorageRepository } from "../repository/Board";
import { BoardService } from "../services/Board";

export default function Main() {
  const boardStorage = LocalStorageRepository<Persisted<Board>>(BoardKey);
  const boardService = BoardService();

  const [boards, setBoards] = useState(() => boardStorage.stored());
  const [selected, setSelected] = useState<Persisted<Board>>();

  const handleNewBoard = (title: string = "New Board") => {
    const newBoard = boardService.createNewBoard({ title, columns: [] });
    setBoards((p) => [...p, newBoard]);
    boardStorage.save(newBoard);
  };

  // const makeBoard = ({
  //   board,
  //   columns,
  //   cards,
  // }: {
  //   board: Board;
  //   columns: Array<Column>;
  //   cards: Array<Card>;
  // }) => ({
  //   ...board,
  //   columns: {
  //     ...board.columns,
  //     ...columns
  //   }
  // });

  if (!boards.length) {
    return (
      <>
        <h1>No boards yet</h1>
        <button onClick={() => handleNewBoard()}>Create new Board</button>
      </>
    );
  }

  if (!selected) {
    return (
      <>
        <ul>
          {boards.map((b) => (
            <li
              style={{ cursor: "pointer", width: "fit-content" }}
              key={b.id}
              data-id={b.id}
              onClick={() => setSelected(b)}
            >
              {b.title}
            </li>
          ))}
        </ul>
        <button onClick={() => handleNewBoard()}>Create new Board</button>
      </>
    );
  }

  const selectedBoard = boards.filter((b) => b.id === selected.id)[0];

  if (selectedBoard) {
    return (
      <>
        <BoardEntry
          board={selectedBoard}
          updateBoard={(newBoard: Persisted<Board>) => {
            const updatedBoards = boards.map((b) =>
              b.id === newBoard.id ? newBoard : b
            );
            setBoards(updatedBoards);
            boardStorage.update(newBoard);
          }}
        />
        <span
          style={{ cursor: "pointer" }}
          onClick={() => setSelected(undefined)}
        >
          🔙
        </span>
      </>
    );
  }
}