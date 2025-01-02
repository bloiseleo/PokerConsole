import Card from "../Card";
import { Player } from "../Player";
import { IWinCondition } from "./IWinCondition";

export default class QuarterCondition implements IWinCondition {
    private _points: number = 0;
    set points(points: number) {
        this._points = points;
    }
    get points(): number {
        return this._points;
    }
    get order(): number {
        return 2;
    }
    calculatePoints(player: Player, tableCards: Card[]): number {
        const cards = [...player.hand.cards, ...tableCards];
        let found = false;
        cards.forEach(c => {
            if(found) return;
            const sameNumberCards = cards.filter(cc => c.number === cc.number);
            if(sameNumberCards.length == 4) {
                found = true;
            }
        })
        if(!found) {
            return 0;
        }
        return this.order;
    }
}