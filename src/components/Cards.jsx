import React, { useState, useEffect } from 'react';
import { createDeck } from '../utils/createDeck';
import BaseCards from '../data/CardData';
import Back from '../assets/cards/Back.png';
import { shuffleDeck } from '../utils/shuffleDeck';
import { DndContext } from "@dnd-kit/core";
import CardPile from './CardPile';
import king from '../assets/cards/king.jpg';
import NavBar from "./NavBar"; // Import NavBar

const Cards = () => {
  const totalCards = 52;
  const [buttons, setButtons] = useState([1, 2, 3, 4, 5]);
  const [remainingButtons, setRemainingButtons] = useState(5);
  const [piles, setPiles] = useState([]);
  const [selectedPile, setSelectedPile] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [draggingPileIndex, setDraggingPileIndex] = useState(null);
  const [completedPiles, setCompletedPiles] = useState([]); // To track completed piles
  const [isGameWon, setIsGameWon] = useState(false); // To track if the game is won
  const [moves, setMoves] = useState(0); // Track moves
  const [correctMoves, setCorrectMoves] = useState(0); // Track correct moves
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Function to check if cards can be moved between piles
  const canMoveCards = (fromPileIndex, toPileIndex, selectedIndexes) => {
    const fromPile = piles[fromPileIndex];
    const toPile = piles[toPileIndex];
    const firstCard = fromPile[selectedIndexes[0]];

    if (toPile.length === 0 && firstCard.rankValue === 14) {  // King can go to an empty pile
      return true;
    }

    const topCardOfTargetPile = toPile[toPile.length - 1];

    if (topCardOfTargetPile.rankValue === firstCard.rankValue + 1) {  // Cards must be in descending order
      return true;
    }

    return false;
  };

  // Function to check if a pile is complete (Ace to King in descending order)
  const isPileComplete = (pile) => {
    if (pile.length !== 13) return false;

    for (let i = 0; i < pile.length - 1; i++) {
      const currentCard = pile[i];
      const nextCard = pile[i + 1];

      if (currentCard.rankValue !== nextCard.rankValue + 1) {
        return false;  // Cards should be in descending order
      }
    }

    return true;
  };

  // Function to handle the drag start event
  const handleDragStart = (event) => {
    const { active } = event;
    const fromPileIndex = parseInt(active.data.current.pileIndex);
    const cardIndex = parseInt(active.data.current.cardIndex);

    const pile = piles[fromPileIndex];
    const selectedIndexes = [];

    for (let i = cardIndex; i < pile.length; i++) {
      if (pile[i].faceUp) {
        selectedIndexes.push(i);
      }
    }

    setSelectedPile(fromPileIndex);
    setSelectedCards(selectedIndexes);
    setDraggingPileIndex(fromPileIndex);
  };

  // Function to handle the drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!active || !over) {
      setDraggingPileIndex(null);
      return;
    }

    const fromPileIndex = parseInt(active.data.current.pileIndex);
    const toPileIndex = parseInt(over.id);

    if (fromPileIndex === toPileIndex) {
      setDraggingPileIndex(null);
      return;
    }

    // Validate the move before applying it
    if (canMoveCards(fromPileIndex, toPileIndex, selectedCards)) {
      setPiles(currentPiles => {
        const newPiles = [...currentPiles];
        const fromPile = [...newPiles[fromPileIndex]];

        const startIndex = Math.min(...selectedCards);
        const cardsToMove = fromPile.splice(startIndex);
        newPiles[fromPileIndex] = fromPile;
        newPiles[toPileIndex] = [...newPiles[toPileIndex], ...cardsToMove];

        if (newPiles[fromPileIndex].length > 0) {
          const lastCard = newPiles[fromPileIndex][newPiles[fromPileIndex].length - 1];
          if (!lastCard.faceUp) {
            lastCard.faceUp = true;
          }
        }

        // Increment score for every valid move
        setCorrectMoves(prev => prev + 1);

        // Check for completed piles after the move
        newPiles.forEach((pile, index) => {
          if (isPileComplete(pile)) {
            setCompletedPiles(prev => [...prev, pile]); // Add completed pile to state
            newPiles[index] = []; // Empty the completed pile
          }
        });

        // Increment moves on valid move
        setMoves(prev => prev + 1);

        // Check if the game is won
        if (completedPiles.length + 1 === 8) {
          setIsGameWon(true); // If 8 piles are complete, game is won
        }

        return newPiles;
      });
    }

    setSelectedPile(null);
    setSelectedCards([]);
    setDraggingPileIndex(null);
  };

  useEffect(() => {
    const deck = createDeck(BaseCards, totalCards);
    const shuffledDeck = shuffleDeck(deck);
    const initialPiles = Array(10).fill().map(() => []);

    for (let i = 0; i < 52; i++) {
      const pileIndex = i % 10;
      const card = shuffledDeck[i];
      if (card) {
        initialPiles[pileIndex].push({
          ...card,
          id: `card-${i}`,
          faceUp: i >= 42
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
      id: `new-card-${Date.now()}-${index}`,
      faceUp: true
    }));

    setPiles(currentPiles =>
      currentPiles.map((pile, index) => [...pile, newCards[index]]));
    
    setButtons(prev => prev.filter((_, idx) => idx !== buttons.length - 1));
    setRemainingButtons(prev => prev - 1);
  };

  const handleSelectCards = (pileIndex, cardIndexes) => {
    if (cardIndexes.length === 0) {
      setSelectedPile(null);
      setSelectedCards([]);
    } else {
      setSelectedPile(pileIndex);
      setSelectedCards(cardIndexes);
    }
  };

  // Timer functionality
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (moves > 0 && !isTimerRunning) {
      setIsTimerRunning(true);
    }
  }, [moves]);

  const handleReset = () => {
    window.location.reload(); // Refresh the page
  };

  return (
    <>
      <NavBar moves={moves} correctMoves={correctMoves} resetGame={handleReset} timer={timer} />
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="card-game bg-blue-200 min-h-screen p-4">
          <div className='flex justify-between mx-16 mr-24 m-3 '>
            <div className='h-[120px]'>
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
            <div className="pile-container flex justify-end gap-4">
              {completedPiles.map((pile, index) => (
                <div key={index} className="h-[120px] w-[95px] bg-blue-100 ring-2 ring-gray-400 rounded-md">
                  <img
                    src={king}
                    alt="King"
                    className="h-full w-full rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="piles flex justify-center mt-12 mx-14">
            {piles.map((pile, pileIndex) => (
              <CardPile
                key={pileIndex}
                pile={pile}
                pileIndex={pileIndex}
                selectedCards={selectedPile === pileIndex ? selectedCards : []}
                isDraggingPile={draggingPileIndex === pileIndex}
                onSelectCards={handleSelectCards}
              />
            ))}
          </div>

          {isGameWon && (
            <div className="game-win text-center mt-8 text-2xl font-bold">
              Congratulations! You've completed the game!
            </div>
          )}
        </div>
      </DndContext>
    </>
  );
};

export default Cards;