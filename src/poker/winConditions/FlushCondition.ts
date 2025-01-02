import Card from "../Card";
import { Player } from "../Player";
import { IWinCondition } from "./IWinCondition";

export default class FlushCondition implements IWinCondition {
    private _points: number = 0;
    set points(points: number) {
        this._points = points;
    }
    get points(): number {
        return this._points;
    }
    get order(): number {
        return 4;
    }
    private findFlush(cards: Card[]): boolean {
        const suitMap: {
            [key: number]: number[]
        } = {};
        cards.forEach((card, index) => {
            if(typeof suitMap[card.suit] !== 'undefined') {
                suitMap[card.suit].push(index);
                return;
            }
            suitMap[card.suit] = [index];
        });
        return Object.entries(suitMap).some(entry => entry[1].length >= 5);
    }
    calculatePoints(player: Player, tableCards: Card[]): number {
        const cards = [...player.hand.cards, ...tableCards];
        if(!this.findFlush(cards)) {
            return 0;
        }
        return this.order;
    }
}