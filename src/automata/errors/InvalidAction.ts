export default class InvalidAction extends Error {
    constructor(action: symbol) {
        super(`Invalid action ${action.toString()}`);
    }
}