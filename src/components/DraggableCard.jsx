import React from 'react';
import { useDraggable } from "@dnd-kit/core";
import Back from '../assets/cards/Back.png';

const DraggableCard = ({ card, cardIndex, pileIndex, style, isSelected, isDragging: isPartOfDraggingGroup, onSelect }) => {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: `${card.id}`,
    data: {
      card,
      pileIndex,
      cardIndex
    },
    disabled: !card.faceUp || (isPartOfDraggingGroup && !isSelected)
  });

  const handleClick = (e) => {
    if (!card.faceUp) return;
    e.stopPropagation();
    onSelect(cardIndex);
  };

  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition: 'none'
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`card absolute transition-all duration-200 
        ${isDragging ? 'opacity-80 z-50 rounded-md' : ''}
        ${isSelected ? 'ring-2 ring-blue-400 shadow-lg rounded-md opacity-80' : ''}
        ${card.faceUp ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed'}`}
      style={{
        ...style,
        ...(isDragging ? dragStyle : {}),
        zIndex: isDragging ? 1000 + cardIndex : style.zIndex,
      }}
    >
      <img
        src={card.faceUp ? card.image : Back}
        alt={card.faceUp ? `Card ${card.rank}` : 'Card back'}
        className="h-[120px] w-auto rounded-md shadow-md border-1 border-md border-gray-200"
      />
    </div>
  );
};

export default DraggableCard;