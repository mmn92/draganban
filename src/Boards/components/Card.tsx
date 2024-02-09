import { Card } from "../model/core";

export function BoardCard({ card }: { card: Card }) {
  return <div className="card-container">{card.title}</div>;
}
