import Card from "../poker/Card";
import { CardSpecialNumber } from "../poker/CardSpecialNumber";

export function numberifyDeckAndSort(deck: Card[]) {
    return deck.map(card => {
        if(typeof card.number === 'number') return card;
        switch(card.number) {
            case CardSpecialNumber.J:
                return new Card(card.suit, 11);
            case CardSpecialNumber.Q:
                return new Card(card.suit, 12);
            case CardSpecialNumber.K:
                return new Card(card.suit, 13);
        }
    }).sort((a, b) => Number(a.number) - Number(b.number));
}