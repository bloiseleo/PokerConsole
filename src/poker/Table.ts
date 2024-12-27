import Card from "./Card";

export default class Table {
    private _pot: number = 0;
    private _cards: Card[] = [];
    private _biggestBet: number = 0;
    constructor(
        private _bigBlind: number,
        private _smallBlind: number,
    ) {}
    get bigBlind() {
        return this._bigBlind;
    }   
    get smallBlind() {
        return this._smallBlind;
    }
    get pot() {
        return this._pot;
    }
    get cards(): Card[] {
        return this._cards.map(c => c);
    }
    get bet() {
        return this._biggestBet;
    }
    public saveBiggestBet(value: number) {
        if(this._biggestBet < value) {
            this._biggestBet = value;
        }
    }
    public addBigBlindToPot() {
        this._pot += this.bigBlind;
        this.saveBiggestBet(this.bigBlind);
    }
    public addSmallBlindToPot() {
        this._pot += this.smallBlind;
        this.saveBiggestBet(this.smallBlind);
    }
    public addToPot(value: number): void {
        if(value <= 0 || Number.isNaN(value)) {
            throw new Error(`Invalid value to be added to the table pot ${value}`);
        }
        this._pot += value;
    }
    public addCards(...cards: Card[]): void {
        this._cards.push(...cards);
    }
}