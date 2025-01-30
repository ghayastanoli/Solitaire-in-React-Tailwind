import React, { useState, useEffect } from 'react';
import { createDeck } from '../utils/createDeck';
import BaseCards from '../data/CardData';
import Back from '../assets/cards/Back.png';
import { shuffleDeck } from '../utils/shuffleDeck';
import { DndContext } from "@dnd-kit/core";
import CardPile from './CardPile';

const Cards = () => {
  const totalCards = 52;
  const [buttons, setButtons] = useState([1, 2, 3, 4, 5]);
  const [remainingButtons, setRemainingButtons] = useState(5);
  const [piles, setPiles] = useState([]); // Store all piles
  const [selectedPile, setSelectedPile] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);

  // Initialize the deck and create initial piles
  useEffect(() => {
    const deck = createDeck(BaseCards, totalCards);
    const shuffledDeck = shuffleDeck(deck);

    // Create 10 piles
    const initialPiles = Array(10).fill().map(() => []);

    // Deal cards to each pile
    for (let i = 0; i < 52; i++) {
      const pileIndex = i % 10;
      const card = shuffledDeck[i];
      if (card) {
        initialPiles[pileIndex].push({
          ...card,
          id: `card-${i}`, // Ensure each card has a unique ID
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
    const newCards = shuffledDeck.slice(0, 10).map((card, index) => ({
      ...card,
      id: `new-card-${Date.now()}-${index}`, // Ensure unique IDs for new cards
      faceUp: true // New cards are always face up
    }));

    setPiles(currentPiles =>
      currentPiles.map((pile, index) => [...pile, newCards[index]])
    );

    // Remove the clicked button
    setButtons(prev => prev.filter((_, idx) => idx !== buttons.length - 1));
    setRemainingButtons(prev => prev - 1);
  };

  const handleSelectCards = (pileIndex, cardIndexes) => {
    setSelectedPile(cardIndexes.length > 0 ? pileIndex : null);
    setSelectedCards(cardIndexes);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!active || !over) return;

    const fromPileIndex = parseInt(active.data.current.pileIndex);
    const toPileIndex = parseInt(over.id);

    if (fromPileIndex === toPileIndex) return;

    setPiles(currentPiles => {
      const newPiles = [...currentPiles];
      const fromPile = [...newPiles[fromPileIndex]];
      
      // Get the starting index for the move (either from the selected cards or the dragged card)
      const startIndex = selectedPile === fromPileIndex ? 
        Math.min(...selectedCards) : 
        active.data.current.cardIndex;
      
      // Move the cards
      const cardsToMove = fromPile.splice(startIndex);
      newPiles[fromPileIndex] = fromPile;
      newPiles[toPileIndex] = [...newPiles[toPileIndex], ...cardsToMove];
      
      // Turn the last card face up in the source pile if it exists
      if (newPiles[fromPileIndex].length > 0) {
        const lastCard = newPiles[fromPileIndex][newPiles[fromPileIndex].length - 1];
        if (!lastCard.faceUp) {
          lastCard.faceUp = true;
        }
      }
      
      return newPiles;
    });

    // Clear selection after move
    setSelectedPile(null);
    setSelectedCards([]);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="card-game bg-blue-200 min-h-screen p-4">
        {/* Deck buttons */}
        <div className='flex justify-between mx-16 mr-24 m-3'>
          <div className="flex justify-start">
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
        </div>

        {/* Card Piles */}
        <div className="piles flex justify-center mt-12">
          {piles.map((pile, pileIndex) => (
            <CardPile
              key={pileIndex}
              pile={pile}
              pileIndex={pileIndex}
              selectedCards={selectedPile === pileIndex ? selectedCards : []}
              onSelectCards={handleSelectCards}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default Cards;