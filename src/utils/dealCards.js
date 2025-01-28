// dealCards.js
export const dealCards = (shuffledDeck, numPiles) => {
    const piles = Array.from({ length: numPiles }, () => []);
    
    shuffledDeck.forEach((card, index) => {
      const pileIndex = index % numPiles; 
      piles[pileIndex].push(card);
    });
    
    return piles;
  };
  