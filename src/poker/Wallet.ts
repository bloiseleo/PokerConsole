import InsufficientCredits from "../errors/InsufficientCredits";

export default class Wallet {
    constructor(private value: number) {}
    get balance(): number {
        return this.value;
    }
    public charge(value: number): void {
        if(value <= 0) {
            throw new Error(`Invalid amount to charge ${value}`);
        }
        if(value > this.value) {
            throw new InsufficientCredits(`You do not contain enough credits to be charged`);
        }
        this.value -= value;
    }
}