export const createDeck = (baseCards, totalCards) => {
  const rankOrder = [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];
  let id = 1;

  while (deck.length < totalCards) {
    baseCards.forEach((card) => {
      deck.push({
        id: id++, 
        rank: card.rank,
        image: card.image,
        rankValue: rankOrder.indexOf(card.rank) + 2, 
      });
    });
  }

  return deck.slice(0, totalCards);
};