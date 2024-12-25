export default class RejectedAction extends Error {
    constructor(message: string) {
        super(`${message}`);
    }
}