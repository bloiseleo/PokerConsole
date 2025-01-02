import Card from "../Card";
import { CardSpecialNumber } from "../CardSpecialNumber";
import { Player } from "../Player";
import { Suit } from "../Suit";
import { IWinCondition } from "./IWinCondition";

export default class RoyalStraightFlushCondition implements IWinCondition {
    get order(): number {
        return 0;
    }
    private getAllSuits(cards: Card[]): Set<Suit> {
        return new Set(cards.map(c => c.suit));
    }
    private containsRoyalFlush(suit: Suit, cards: Card[]): boolean {
        const sameSuitDeck = cards.filter(c => c.suit == suit);
        return sameSuitDeck.some((c) => {
            return c.number == 10
        }) &&
        sameSuitDeck.some((c) => {
            return c.number == 1
        }) && sameSuitDeck.some((c) => {
            return c.number == CardSpecialNumber.Q
        }) &&
        sameSuitDeck.some((c) => {
            return c.number == CardSpecialNumber.J
        }) &&
        sameSuitDeck.some((c) => {
            return c.number == CardSpecialNumber.K
        })
    }
    calculatePoints(player: Player, tableCards: Card[]): number {
        const cards = [...player.hand.cards, ...tableCards];
        const suits = this.getAllSuits(cards);
        let points = 0;
        suits.forEach((suit) => {
            if(points != 0) return;
            if(this.containsRoyalFlush(suit, cards)) {
                points = -1;
            }
        })
        return points;
    }

}