import React from 'react';
import { useDroppable } from "@dnd-kit/core";
import DraggableCard from './DraggableCard';

const CardPile = ({ pile, pileIndex, selectedCards, isDraggingPile, onSelectCards }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${pileIndex}`
  });

  const handleCardSelect = (clickedIndex) => {
    const selectedIndexes = [];
    for (let i = clickedIndex; i < pile.length; i++) {
      if (pile[i].faceUp) {
        selectedIndexes.push(i);
      }
    }
    onSelectCards(pileIndex, selectedIndexes);
  };

  const handlePileClick = (e) => {
    e.stopPropagation();
    onSelectCards(pileIndex, []);
  };

  return (
    <div 
      ref={setNodeRef}
      onClick={handlePileClick}
      className={`pile relative w-[120px] mx-2 ${isOver ? ' bg-opacity-50 rounded-md' : ''}`}
      style={{
        minHeight: `${180 + (pile.length - 1) * 30}px`,
      }}
    >
      {pile.map((card, cardIndex) => (
        <DraggableCard
          key={`${pileIndex}-${cardIndex}`}
          card={card}
          cardIndex={cardIndex}
          pileIndex={pileIndex}
          style={{
            top: `${cardIndex * 30}px`,
            zIndex: cardIndex,
          }}
          isSelected={selectedCards.includes(cardIndex)}
          isDragging={isDraggingPile && selectedCards.includes(cardIndex)}
          onSelect={handleCardSelect}
        />
      ))}
    </div>
  );
};

export default CardPile;