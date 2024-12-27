import Card from "./Card";
import PokerCard from "./Card";
import { CardSpecialNumber } from "./CardSpecialNumber";
import { Suit } from "./Suit";

export default class Deck {
    constructor(
        private cards: PokerCard[]
    ) { }
    static generateDefault(): Deck {
        const allSuits = [
            Suit.CLUBS,
            Suit.DIAMONDS,
            Suit.HEARTS,
            Suit.CLUBS
        ]
        return new Deck(allSuits.map(suit => {
            const cards = [];
            for(let i = 1; i <= 10; i++) {
                cards.push(new PokerCard(
                    suit,
                    i
                ));
            }
            cards.push(new PokerCard(suit, CardSpecialNumber.J));
            cards.push(new PokerCard(suit, CardSpecialNumber.Q));
            cards.push(new PokerCard(suit, CardSpecialNumber.K));
            return cards;
        }).reduce((deck, cards) => {
            cards.forEach(card => deck.push(card))
            return deck;
        }, [] as PokerCard[]));     
    }
    public getRandomCard(): Card {
        const cardDeckIndex = Math.floor(Math.random() * this.cards.length);
        const card = this.cards[cardDeckIndex];
        this.cards = this.cards.filter((_, cardIndex) => cardIndex !== cardDeckIndex);
        return card;
    }
    public getNCardsFromDeck(n: number): Card[] {
        const cards: Card[] = [];
        if(n <= 0) {
            throw new Error(`Invalid amount ${n} of cards to take`);
        }
        for(let i = 0; i < n; i++) cards.push(this.getRandomCard());
        return cards;
    }
}