import { PokerTurn, TurnData, TurnResponse } from "../PokerTurn";
import { Player } from "./Player";
import PokerCard from "./PokerCard";

export default interface PokerGame {
    get partyCapacity(): number;
    get smallBlind(): number;
    get bigBlind(): number;
    get turn(): PokerTurn | undefined;
    get pot(): number;
    get allPlayersPlayedAlready(): boolean;
    get tableCards(): PokerCard[];
    get playersInTableQuantity(): number;
    processWinner(): Player | undefined;
    resetTurn(): void;
    addPlayer(player: Player): void;
    preFlop(): void;
    getPlayers(): Player[];
    partyAlreadyFull(): boolean;
    partyWithMinimumRequired(): boolean;
    advanceTurn(turn: TurnData): TurnResponse;
    getLastTurn(): PokerTurn | undefined;
    playersStillNeedToPlay(): boolean;
    takeFlopCards(): void;
}