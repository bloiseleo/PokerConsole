export default abstract class PokerError extends Error {
    constructor(message: string) {
        super(message);
    }
}