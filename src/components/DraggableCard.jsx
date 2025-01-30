import React from 'react';
import { useDraggable } from "@dnd-kit/core";
import Back from '../assets/cards/Back.png';

const DraggableCard = ({ card, cardIndex, pileIndex, style, isSelected, onSelect, onSelectCards }) => {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: `${card.id}`,
    data: {
      card,
      pileIndex,
      cardIndex
    },
    disabled: !card.faceUp // Disable dragging for face-down cards
  });

  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


  const handleCardSelect = (e) => {
    const selectedIndexes = [];
    // Select all cards from the clicked card to the bottom of the pile
    for (let i = 0; i <= cardIndex; i++) {
      if (pile[i].faceUp) {
        selectedIndexes.push(i); // Add the index to the selected cards
      }
    }
    onSelectCards(pileIndex, selectedIndexes); // Pass the selected indexes to parent
  };
  



  const handleClick = (e) => {
    if (!card.faceUp) return; // Prevent selecting face-down cards
    e.stopPropagation();
    onSelect();
  };
  
  

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick} 
      className={`card absolute
        ${isSelected ? 'scale-105' : ''}
        ${card.faceUp ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        
      style={{
        ...style,
        ...dragStyle,
        zIndex: isDragging  ? 1000 : 'auto',
      }}
    >
      <img
        src={card.faceUp ? card.image : Back}
        alt={card.faceUp ? `Card ${card.rank}` : 'Card back'}
        className="h-[120px] w-auto rounded-lg shadow-md border-1 border-gray-200"
      />
    </div>
  );
};

export default DraggableCard;