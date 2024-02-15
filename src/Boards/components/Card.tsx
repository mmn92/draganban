import { Card } from "../model/core";

export function BoardCard({
  card,
  canPrevious = false,
  handlePrevious,
  canNext = false,
  handleNext,
}: {
  card: Card;
  canPrevious: boolean;
  handlePrevious: () => void;
  canNext: boolean;
  handleNext: () => void;
}) {
  return (
    <div className="card-container">
      <section className="card-title">
        <h3>{card.title}</h3>
      </section>
      <section className="card-action">
        {canPrevious && (
          <button onClick={handlePrevious} className="previous">
            ⬅️
          </button>
        )}
        {canNext && (
          <button onClick={handleNext} className="next">
            ➡️
          </button>
        )}
      </section>
    </div>
  );
}
