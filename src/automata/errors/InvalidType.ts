export default class InvalidType extends Error {
    constructor(type: Object) {
        super(`Type invalid, it must be ${type.toString()}`);
    }
}