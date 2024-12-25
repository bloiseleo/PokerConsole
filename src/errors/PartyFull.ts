import PokerError from "./PokerError";

export default class PartyFull extends PokerError {
    constructor() {
        super('Party already full')
    }
}