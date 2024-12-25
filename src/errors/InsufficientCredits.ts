import PokerError from "./PokerError";

export default class InsufficientCredits extends PokerError {
    constructor(message: string) {
        super(message);
    }
}