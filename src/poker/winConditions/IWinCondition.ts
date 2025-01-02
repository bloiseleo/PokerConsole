import Card from "../Card";
import { Player } from "../Player";

export interface IWinCondition {
    set points(points: number);
    get points(): number;
    get order(): number;
    calculatePoints(player: Player, tableCards: Card[]): number;
}