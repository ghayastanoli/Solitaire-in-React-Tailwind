import React from 'react';
import { useDroppable } from "@dnd-kit/core";
import DraggableCard from './DraggableCard';

const CardPile = ({ pile, pileIndex, selectedCards, onSelectCards }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${pileIndex}`
  });

  const handleCardSelect = (cardIndex) => {
    const selectedIndexes = [];
    // Select all cards from the clicked card to the bottom of the pile
    for (let i = 0; i <= cardIndex; i++) {
      if (pile[i].faceUp) {
        selectedIndexes.push(i);
      }
    }
    onSelectCards(pileIndex, selectedIndexes);
  };

  // Clear selection when clicking the pile background
  const handlePileClick = () => {
    onSelectCards(pileIndex, []);
  };

  return (
    <div 
      ref={setNodeRef}
      onClick={handlePileClick}
      className={`pile relative w-[120px] mx-2 ${isOver ? ' rounded-lg' : ''}`}
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
          onSelect={handleCardSelect}
        />
      ))}
    </div>
  );
};

export default CardPile;