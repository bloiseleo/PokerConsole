import { TurnData, TurnResponse } from "../../PokerTurn";
import Table from "../Table";
import IPokerAction from "./IPokerAction";

export default class TexasHoldemCheck implements IPokerAction {
    constructor(private table: Table) {}
    execute({ player }: TurnData): TurnResponse {
        if(player.bet != this.table.bet) {
            return {
                message: `Player ${player.name} cannot check`,
                success: false
            };
        }
        return {
            message: `Player ${player.name} checked`,
            success: true
        };
    }
}