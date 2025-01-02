import { numberifyDeckAndSort } from "../../helpers/DeckHelpers";
import Numbers from "../../helpers/Numbers";
import Card from "../Card";
import { Player } from "../Player";
import { Suit } from "../Suit";
import { IWinCondition } from "./IWinCondition";

export default class StraightFlushCondition implements IWinCondition {
    private _points: number = 0;
    set points(points: number) {
        this._points = points;
    }
    get points(): number {
        return this._points;
    }
    get order(): number {
        return 1;
    }
    private getAllSuits(cards: Card[]): Set<Suit> {
        return new Set(cards.map(c => c.suit));
    }
    private verifyStraightFlush(cards: Card[]) {
        const suits = this.getAllSuits(cards);
        let straightFlush = false;
        suits.forEach(suit => {
            if(straightFlush) return;
            const sameSuitCards = new Set(cards.filter(c => c.suit == suit).map(c => c.number as number));
            straightFlush = Numbers.iSequence(sameSuitCards) && sameSuitCards.size == 5;
        });
        return straightFlush;
    }
    calculatePoints(player: Player, tableCards: Card[]): number {
        const cards = numberifyDeckAndSort([...tableCards, ...player.hand.cards]);
        const straightFlush = this.verifyStraightFlush(cards);
        if(!straightFlush) {
            return 0;
        }
        return 1;
    }
}