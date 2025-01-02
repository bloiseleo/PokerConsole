import Card from "../Card";
import { Player } from "../Player";

export interface IWinCondition {
    get order(): number;
    calculatePoints(player: Player, tableCards: Card[]): number;
}