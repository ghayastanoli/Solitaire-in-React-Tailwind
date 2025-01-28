export const createDeck = (baseCards, totalCards) => {
    const deck = [];
    let id = 1;
  
    while (deck.length < totalCards) {
      baseCards.forEach((card) => {
        deck.push({
          id: id++, 
          rank: card.rank,
          image: card.image,
        });
      });
    }
  
    return deck.slice(0, totalCards);
     
  };  