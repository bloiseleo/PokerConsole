import { TurnData, TurnResponse } from "../../PokerTurn";

export default interface IPokerRaise {
    execute(data: TurnData): TurnResponse;
}