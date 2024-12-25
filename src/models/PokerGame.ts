import { PokerTurn, TurnData, TurnResponse } from "../PokerTurn";
import { Player } from "./Player";

export default interface PokerGame {
    get partyCapacity(): number;
    get smallBlind(): number;
    get bigBlind(): number;
    get turn(): PokerTurn | undefined;
    get pot(): number;
    get allPlayersPlayedAlready(): boolean;
    resetTurn(): void;
    addPlayer(player: Player): void;
    preFloop(): void;
    getPlayers(): Player[];
    partyAlreadyFull(): boolean;
    partyWithMinimumRequired(): boolean;
    advanceTurn(turn: TurnData): TurnResponse;
    getLastTurn(): PokerTurn | undefined;
    playersStillNeedToPlay(): boolean;
}