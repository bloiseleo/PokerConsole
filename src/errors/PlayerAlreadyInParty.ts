import PokerError from "./PokerError";

export default class PlayerAlreadyInParty extends PokerError {
    constructor(id: string | number) {
        super(`Player of ${id} already in the party`)
    }
}