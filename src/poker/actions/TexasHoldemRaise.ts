import { TurnData, TurnResponse } from "../../PokerTurn";
import Table from "../Table";
import IPokerAction from "./IPokerAction";

export default class TexasHoldemRaise implements IPokerAction {
    constructor(private table: Table) {}
    execute({value, player}: TurnData): TurnResponse {
        if(value <= 0) {
            return {
                message: `The value must be positive. ${value} provided`,
                success: false
            };
        }
        const total = player.bet + value;
        if(total <= this.table.bet) {
            return {
                message: `Insufficient Value ${total}`,
                success: false
            };
        }
        player.charge(value);
        this.table.addToPot(value);
        this.table.saveBiggestBet(player.bet);
        return {
            message: `Player ${player.name} raised!`,
            success: true
        };
    }
}