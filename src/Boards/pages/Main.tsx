import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
        <button className="pointer app-btn" onClick={() => handleNewBoard()}>
          Create new Board
        </button>
      </>
    );
  }

  console.log("BOARDS:", boards, selected);

  const selectedBoard = boards.filter((b) => b.id === selected.id)[0];

  console.log("SELECTED BOARD:", selectedBoard);

  if (selectedBoard) {
    return (
      <DndProvider backend={HTML5Backend}>
        <BoardEntry
          key={JSON.stringify(selectedBoard)}
          board={selectedBoard}
          updateBoard={(newBoard: Persisted<Board>) => {
            console.log("NEWBOARD:", newBoard);
            const updatedBoards = boards.map((b) =>
              b.id === newBoard.id ? newBoard : b
            );

            setBoards(updatedBoards);
            boardStorage.update(newBoard);
          }}
        />
        <span
          style={{ cursor: "pointer", padding: "0 32px" }}
          onClick={() => setSelected(undefined)}
        >
          🔙
        </span>
      </DndProvider>
    );
  }
}
