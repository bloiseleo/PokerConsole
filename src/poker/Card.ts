import { CardSpecialNumber } from "./CardSpecialNumber";
import { Suit } from "./Suit";


export default class Card {
    constructor(
        public suit: Suit,
        public number: number | CardSpecialNumber
    ) { }
    
    get suitString(): string {
        switch(this.suit) {
            case Suit.CLUBS:
                return '♣️';
            case Suit.SPADES:
                return '♠️';
            case Suit.DIAMONDS:
                return '♦️';
            case Suit.HEARTS:
                return '♥️';
        }
    }
    get numberString(): string {
        return this.number.toString();
    }
    toString() {
        const suitString = this.suitString;
        const numberString = this.numberString;
        return `${numberString} ${suitString}`;
    }
}