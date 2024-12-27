import PokerCard from "./Card";
import Wallet from "./Wallet";
import PokerHand from "./Hand";

export class Player {
    private blind: number = 0;
    private _hand: PokerHand = new PokerHand();
    private _bet: number = 0;
    constructor(
        public id: number,
        public name: string,
        private wallet: Wallet
    ) { }
    toString() {
        return this.name;
    }
    get bet() {
        return this._bet;
    }
    get blindPick() {
        return this.blind;
    }
    get valueInWallet() {
        return this.wallet.balance;
    }
    chargeBlind(blind: number) {
        this.charge(blind);
        this.blind = blind;
    }
    charge(quantity: number): void {
        this.wallet.charge(quantity);
        this._bet += quantity;
    }
    get hand() {
        return this._hand
    }
    public addToHand(...card: PokerCard[]) {
        card.forEach(c => this._hand.add(c));
    }
}