import { Player } from "./poker/Player";

export class PokerTurn {
    constructor(
        public player: Player,
        public action?: symbol,
        public value: number = 0,
    ) {}
}

export class TurnData {
    constructor(
        public action: symbol,
        public value: number,
        public player: Player
    ) {}
};

export class TurnResponse {
    constructor(
        public success: boolean,
        public message: string
    ) {}
}
