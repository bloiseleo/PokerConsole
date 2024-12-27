import Party from "./Party";
import Round from "./Round";

export default class RoundHistory {
    private _rounds: Round[] = []
    private _currentRound?: Round;
    constructor(private party: Party) {}
    get currentRound(): Round | undefined {
        return this._currentRound;
    }
    public nextRound(): Round {
        if(this._currentRound) {
            this._rounds.push(this._currentRound);
        }
        this._currentRound = new Round(this.party);
        return this._currentRound;
    }
    public add(round: Round): void {
        this._rounds.push(round);
    }
}