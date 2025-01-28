import React, { useState } from 'react';
import { createDeck } from '../utils/createDeck';
import BaseCards from '../data/CardData';
import Back from '../assets/cards/Back.png';

const Cards = () => {
  const totalCards = 52;
  const [randomCards, setRandomCards] = useState([]); // Cards displayed
  const [buttons, setButtons] = useState([0, 1, 2, 3, 4]); // Array to track buttons
  const [remainingButtons, setRemainingButtons] = useState(5); // Number of buttons remaining
  
  const finalrow = () =>{
    const fullDeck = createDeck(BaseCards, totalCards);
    const shuffledDeck = fullDeck.sort(() => Math.random() - 0.5);
    const selectedCards = shuffledDeck.slice(0, 10);
    setRandomCards(selectedCards);
  }

  // Initialize cards and shuffle when all buttons are reset
  const handleButtonClick1 = () => {
    if (remainingButtons === 0) return; // No more actions if all buttons are used
    const fullDeck = createDeck(BaseCards, totalCards);
    const shuffledDeck = fullDeck.sort(() => Math.random() - 0.5);
    const selectedCards = shuffledDeck.slice(0, 10);
    setRandomCards(selectedCards);
    setRemainingButtons(5); // Reset the remaining buttons
  };

  // Handle button clicks
  const handleButtonClick = (index) => {
    setButtons((prev) => prev.filter((buttonIndex) => buttonIndex !== index)); 
    setRemainingButtons((prev) => prev - 1); 
    handleButtonClick1(); 
  };

  return (
    <div className="card-game bg-blue-200 h-[100vh] p-4">

      {/* 5 Buttons */}
      <div className="relative flex gap-0"> 
        {buttons.map((index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(index)}
            className={`absolute top-0 transition-opacity duration-800`}
            style={{ left: `${index * 20}px` }} 
          >
            <img src={Back} alt="Back" className="h-30" />
          </button>
        ))}
      </div>

      {/* Cards Display */}
      <div className="cards-display flex gap-2 mt-34 ">
        {randomCards.map((card, index) => (
          <div key={card.id} className="card flex ">
            <img src={card.image} alt={`Card ${card.rank}`} className="h-30" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;