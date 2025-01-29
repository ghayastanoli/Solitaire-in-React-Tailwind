import React, { useState } from 'react';
import { createDeck } from '../utils/createDeck';
import BaseCards from '../data/CardData';
import Back from '../assets/cards/Back.png';
import { dealCards } from '../utils/dealCards';

const Cards = () => {
  const totalCards = 52;
  const [randomCards, setRandomCards] = useState([]); // Cards displayed
  const [buttons, setButtons] = useState([1, 2, 3, 4, 5]); // Array to track buttons
  const [remainingButtons, setRemainingButtons] = useState(5); // Number of buttons remaining
  const [cardRows, setCardRows] = useState([]);
  const [deck, setDeck] = useState([]);


  // Initialize cards and shuffle when all buttons are reset
  const handleButtonClick1 = () => {
    if (remainingButtons === 0) return; // No more actions if all buttons are used
    const fullDeck = createDeck(BaseCards, totalCards);
    const shuffledDeck = fullDeck.sort(() => Math.random() - 0.5);
    const selectedCards = shuffledDeck.slice(0, 10);
    setCardRows((prevRows) => [...prevRows, selectedCards]);
    setRemainingButtons(5);
    
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
            disabled={index !== buttons.length}
            className={`absolute top-0 transition-opacity duration-800`}
            style={{ left: `${index * 20}px` }} 
          >
            <img src={Back} alt="Back" className="h-30" />
          </button>
        ))}
      </div>


        {/* Cards Display */}
        <div className="cards-display flex flex-col gap-4 mt-34">
            {cardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center "
        style={{
            position: 'relative', // Add relative positioning
            bottom: `${rowIndex * 112}px`, // Adjust the vertical position for the rows
          }} >
            {row.map((card) => (
        <div key={card.id} className="card">
          <img src={card.image} alt={`Card ${card.rank}`} className="h-30 border-1 border-gray-100"  
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