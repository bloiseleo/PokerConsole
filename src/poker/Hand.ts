import HandFull from "../errors/HandFull";
import Card from "./Card";

export default class PokerHand {
    private limit: number = 2;
    private _cards: Card[] = [];
    public add(card: Card): void {
        if(this._cards.length >= this.limit) {
            throw new HandFull();
        }
        this._cards.push(card);
    }
    get cards() {
        return this._cards;
    }
}