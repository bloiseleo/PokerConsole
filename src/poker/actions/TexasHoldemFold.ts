import { TurnData, TurnResponse } from "../../PokerTurn";
import Party from "../Party";
import IPokerFold from "./IPokerFold";

export default class TexasHoldemFold implements IPokerFold {
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