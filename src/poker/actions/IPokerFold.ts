import { TurnData, TurnResponse } from "../../PokerTurn";

export default interface IPokerFold {
    execute(data: TurnData): TurnResponse;
}