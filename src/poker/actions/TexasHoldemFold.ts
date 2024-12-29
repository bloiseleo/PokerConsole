import { TurnData, TurnResponse } from "../../PokerTurn";
import Party from "../Party";
import IPokerAction from "./IPokerAction";

export default class TexasHoldemFold implements IPokerAction {
    constructor(
        private party: Party,
    ) {}
    execute({ player }: TurnData): TurnResponse {
        this.party.removePlayer(player);
        return {
            message: `Player ${player} removed!`,
            success: true
        }
    }
}