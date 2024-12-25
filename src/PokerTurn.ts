import { Player } from "./models/Player";

export class PokerTurn {
    constructor(
        public player: Player,
        public action?: symbol
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
