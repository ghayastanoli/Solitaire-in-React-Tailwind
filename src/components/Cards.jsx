import React, { useState, useEffect } from 'react';
import { createDeck } from '../utils/createDeck';
import BaseCards from '../data/CardData';
import Back from '../assets/cards/Back.png';
import { shuffleDeck } from '../utils/shuffleDeck';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Cards = () => {
  const totalCards = 52;
  const [buttons, setButtons] = useState([1, 2, 3, 4, 5]);
  const [remainingButtons, setRemainingButtons] = useState(5);
  const [piles, setPiles] = useState([]); // Store all piles

  // Initialize the deck and create initial piles
  useEffect(() => {
    const deck = createDeck(BaseCards, totalCards);
    const shuffledDeck = shuffleDeck(deck);
    
    // Create 10 piles
    const initialPiles = Array(10).fill().map(() => []);
    
    // Deal 4 cards to each pile
    for (let i = 0; i < 52; i++) {
      const pileIndex = i % 10;
      const card = shuffledDeck[i];
      if (card) {
        initialPiles[pileIndex].push({
          ...card,
          faceUp: i >= 42 // Only the top card of each pile is face up
        });
      }
    }
    
    setPiles(initialPiles);
  }, []);

  const handleButtonClick = (buttonIndex) => {
    if (remainingButtons === 0) return;

    const deck = createDeck(BaseCards, totalCards);
    const shuffledDeck = shuffleDeck(deck);
    const newCards = shuffledDeck.slice(0, 10).map(card => ({
      ...card,
      faceUp: true // New cards are always face up
    }));

    setPiles(currentPiles => 
      currentPiles.map((pile, index) => [...pile, newCards[index]])
    );

    setButtons(prev => prev.filter(idx => idx !== buttonIndex));
    setRemainingButtons(prev => prev - 1);
  };

  return (
    <div className="card-game bg-blue-200 min-h-screen p-4">
      {/* Deck buttons */} 
      <div className='flex justify-between mx-16 mr-24 m-3'>     
      <div className=" flex justify-start">
        {buttons.map((_, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(index)}
          disabled={index !== buttons.length - 1} 
          className="relative transition-all duration-300 hover:scale-105"
          style={{ marginLeft: index === 0 ? "0px" : "-60px" }} 
         >
          <img 
          src={Back} 
          alt="Back" 
          className="h-[120px] w-auto"
          />
        </button>
        ))}
      </div>
      <div className='flex gap-3'>
        <div className='min-h-[120px] w-[90px] bg-blue-100 border-1 border-slate-400 bg-opacity-2 rounded-md'>
            <h3></h3>
        </div>
        <div className='min-h-[120px] w-[90px] bg-blue-100 border-1 border-slate-400 bg-opacity-2 rounded-md'>
            <h3></h3>
        </div>
        <div className='min-h-[120px] w-[90px] bg-blue-100 border-1 border-slate-400 bg-opacity-2 rounded-md'>
            <h3></h3>
        </div>
        <div className='min-h-[120px] w-[90px] bg-blue-100 border-1 border-slate-400 bg-opacity-2 rounded-md'>
            <h3></h3>
        </div>
      </div>
      </div>
     
      {/* Card Piles */}
      <div className="piles flex justify-center mt-12">
        {piles.map((pile, pileIndex) => (
          <div key={pileIndex} className="pile relative min-h-[180px] w-[120px]">
            {pile.map((card, cardIndex) => (
              <div
                key={`${pileIndex}-${cardIndex}`}
                className="card absolute transition-all duration-300"
                style={{
                  top: `${cardIndex * 30}px`,
                  zIndex: cardIndex,
                }}
              >
                <img
                  src={card.faceUp ? card.image : Back}
                  alt={card.faceUp ? `Card ${card.rank}` : 'Card back'}
                  className="h-[120px] w-auto rounded-lg shadow-md border-1 border-gray-200"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;