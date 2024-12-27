import { PokerTurn } from "../PokerTurn";
import Party from "./Party";

export default class Round {
    private turns: PokerTurn[] = [];
    private currentTurnIndex = 0;
    private nextTurnIndex = 0;
    constructor(private party: Party) {}
    private resetCurrentTurnIndexIfNeeded() {
        if(this.party.size <= this.nextTurnIndex) {
            this.nextTurnIndex = 0;
        }
        this.currentTurnIndex = this.nextTurnIndex;
        this.nextTurnIndex++;
    }
    get turn() {
        return this.turns.at(this.currentTurnIndex);
    }
    private getPlayerOfTurn() {
        return this.party.at(this.currentTurnIndex);
    }
    get allPlayersPlayedOnce() {
        const turnsWithActions = this.turns.filter(turn => turn.action !== undefined);
        let allPlays = 0;
        this.party.forEach(p => {
            const played = turnsWithActions.find(turn => turn.player.id == p.id);
            if(played) allPlays++;
        })
        return allPlays == this.party.size;
    }
    nextTurn(): PokerTurn {
        this.resetCurrentTurnIndexIfNeeded();
        const player = this.getPlayerOfTurn();
        const turn = new PokerTurn(player);
        this.turns.push(turn);
        return turn;
    }
}