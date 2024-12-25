import InsufficientCredits from "../errors/InsufficientCredits";
import PokerCard from "./PokerCard";

export class Player {
    public hand: PokerCard[] = [];
    private wallet: number = 200;
    private charged = 0;
    private blind: number = 0;
    constructor(
        public id: number,
        public name: string
    ) { }
    toString() {
        return this.name;
    }
    get chargedMoney() {
        return this.charged;
    }
    get blindPick() {
        return this.blind;
    }
    get valueInWallet() {
        return this.wallet;
    }
    chargeBlind(blind: number) {
        if(!this.charge(blind)) {
            throw new InsufficientCredits(`Player ${this.toString()} has not enough credits to blind value ${blind}`);
        };
        this.blind = blind;
    }
    charge(quantity: number): boolean {
        if(this.wallet >= quantity) {
            this.wallet-=quantity;
            this.charged += quantity;
            return true;
        }
        return false;
    }
}