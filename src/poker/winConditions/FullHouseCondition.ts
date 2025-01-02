import Card from "../Card";
import { Player } from "../Player";
import { IWinCondition } from "./IWinCondition";

export default class FullHouseCondition implements IWinCondition {
    private _points: number = 0;
    set points(points: number) {
        this._points = points;
    }
    get points(): number {
        return this._points;
    }
    get order(): number {
        return 3;
    }
    private findFullHouse(cards: Card[]): boolean {
        const hashmap: {
            [key: string]: number[] 
        } = {};
        cards.forEach((c, index) => {
            if(typeof hashmap[c.number.toString()] !== 'undefined') {
                hashmap[c.number.toString()].push(index);
                return;
            }
            hashmap[c.number.toString()] = [index];
        });
        const entries = Object.entries(hashmap);
        const entriesWithMoreThan2Cards = entries.filter(([_, arrindexes]) => {
            return arrindexes.length >= 2;
        });
        if(entriesWithMoreThan2Cards.length < 2) {
            return false;
        }
        const indexOfTripleCards = entriesWithMoreThan2Cards
            .findIndex(([_, arrindexes]) => arrindexes.length >= 3);
        const indexOfPair = entriesWithMoreThan2Cards
            .filter((_, index) => index == indexOfTripleCards)
            .findIndex(([_, arrindexes]) => arrindexes.length >= 2);
        
        if(indexOfPair == -1 || indexOfTripleCards == -1) {
            return false;
        }
        return true;
    }
    calculatePoints(player: Player, tableCards: Card[]): number {
        const cards = [...player.hand.cards, ...tableCards];
        if(!this.findFullHouse(cards)) {
            return 0;
        };
        return this.order;
    }

}