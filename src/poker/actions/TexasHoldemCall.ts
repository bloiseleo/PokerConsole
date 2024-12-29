import { TurnData, TurnResponse } from "../../PokerTurn";
import Table from "../Table";
import IPokerAction from "./IPokerAction";

export default class TexasHoldemCall implements IPokerAction {
    constructor(
        private table: Table,
    ) {}
    execute({ player }: TurnData): TurnResponse {
        if(player.bet >= this.table.bet) {
            return {
                message: `Player ${player.name} cannot call!`,
                success: false
            }
        }
        const valueToReachTableValue = this.table.bet - player.bet;
        player.charge(valueToReachTableValue);                
        this.table.addToPot(valueToReachTableValue);
        return {
            message: `Player ${player.name} called!`,
            success: true
        };
    }
}