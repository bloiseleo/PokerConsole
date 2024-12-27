import PartyFull from "../errors/PartyFull";
import PlayerAlreadyInParty from "../errors/PlayerAlreadyInParty";
import { Player } from "./Player";

export default class Party {
    constructor(
        private min: number,
        private limit: number,
        private players: Player[] = []
    ) { }
    get size() {
        return this.players.length;
    }
    get isFull() {
        return this.players.length >= this.limit;
    }
    get capacity() {
        return this.limit;
    }
    get minimumFulfilled() {
        return this.min <= this.players.length;
    }
    private playerAlreadyInTheParty(player: Player): boolean {
        return this.players.some(p => player.id === p.id);
    }
    public contains(p: Player): boolean {
        return this.playerAlreadyInTheParty(p);''
    }
    public forEach(callback: (p: Player, pIndex: number) => void) {
        this.players.forEach(callback);
    }
    public addPlayer(player: Player): void {
        if(this.isFull) {
            throw new PartyFull();
        }
        if(this.playerAlreadyInTheParty(player)) {
            throw new PlayerAlreadyInParty(player.id.toString());
        }
        this.players.push(player);
    }
    public removePlayer(player: Player): void {
        this.players = this.players.filter(p => p.id !== player.id);
    }
    public at(index: number): Player { 
        if(index < 0 || index >= this.players.length) {
            throw new Error('Index out of bounds for party');
        }
        return this.players.at(index)!;
    }
}