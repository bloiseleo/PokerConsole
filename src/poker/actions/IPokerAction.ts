import { TurnData, TurnResponse } from "../../PokerTurn";

export default interface IPokerAction {
    execute(data: TurnData): TurnResponse;
}