enum Suit {
    CLUBS,
    HEARTS,
    SPADES,
    DIAMONDS
}

enum CardSpecialNumber {
    J = 'J',
    Q = 'Q',
    K = 'K'
}

export default class PokerCard {
    constructor(
        public suit: Suit,
        public number: number | CardSpecialNumber
    ) { }
    static generateDefault(): PokerCard[] {
        const allSuits = [
            Suit.CLUBS,
            Suit.DIAMONDS,
            Suit.HEARTS,
            Suit.CLUBS
        ]
        return allSuits.map(suit => {
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
        }, [] as PokerCard[]);     
    }
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