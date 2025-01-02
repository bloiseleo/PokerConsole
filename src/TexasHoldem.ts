import { Player } from "./poker/Player";
import { CALL_BET, CHECK_BET, FOLD_BET, RAISE_BET } from "./poker/symbols/PokerBetActions";
import Party from "./poker/Party";
import { PokerTurn, TurnData, TurnResponse } from "./PokerTurn";
import Deck from "./poker/Deck";
import Table from "./poker/Table";
import RoundHistory from "./poker/RoundHistory";
import TexasHoldemFold from "./poker/actions/TexasHoldemFold";
import TexasHoldemRaise from "./poker/actions/TexasHoldemRaise";
import IPokerAction from "./poker/actions/IPokerAction";
import TexasHoldemCall from "./poker/actions/TexasHoldemCall";
import TexasHoldemCheck from "./poker/actions/TexasHoldemCheck";

export default class TexasHoldem {
    private history: RoundHistory;
    private foldAction: IPokerAction;
    private raiseAction: IPokerAction;
    private callAction: IPokerAction;
    private checkAction: IPokerAction;
    constructor(
        private party: Party,
        private deck: Deck,
        private table: Table
    ) { 
        this.history = new RoundHistory(party);
        this.foldAction = new TexasHoldemFold(party);
        this.raiseAction = new TexasHoldemRaise(table);
        this.callAction = new TexasHoldemCall(table);
        this.checkAction = new TexasHoldemCheck(table);
    }
    static build() {
        return new TexasHoldem(
            new Party(2, 5),
            Deck.generateDefault(),
            new Table(
                5,
                10
            )
        )
    }
    get players(): Player[] {
        const players: Player[] = [];
        this.party.forEach(p => {
            players.push(p);
        });
        return players;
    }
    get allPartyPlayedOnce(): boolean {
        return Boolean(this.history.currentRound?.allPlayersPlayedOnce);
    }
    get pot() {
        return this.table.pot;
    }
    get tableCards() {
        return this.table.cards;
    }
    get bigBlind(): number {
        return this.table.bigBlind;
    }
    get smallBlind(): number {
        return this.table.smallBlind;
    }
    get partyCapacity(): number {
        return this.party.capacity;
    }
    get partySize(): number {
        return this.party.size;
    }
    get turn(): PokerTurn | undefined {
        return this.history.currentRound?.turn;
    }
    public addPlayer(player: Player): void {
        this.party.addPlayer(player);
    }
    private getCurrentRoundOrCreateIfNotExists() {
        let round = this.history.currentRound;
        if(!round) {
           round = this.history.nextRound();
        }
        return round;
    }
    private createNextTurn() {
        this.getCurrentRoundOrCreateIfNotExists().nextTurn();
    }
    private updateCurrentTurnAction(action: symbol) {
        if(this.turn) {
            this.turn.action = action;
        }
    }
    preFlop(): void {
        this.party.forEach((player, playerIndex) => {
            if(playerIndex % 2 == 0) {
                player.chargeBlind(this.bigBlind);
                this.table.addBigBlindToPot();
            } else {
                player.chargeBlind(this.smallBlind);
                this.table.addSmallBlindToPot();
            }
            player.addToHand(...this.deck.getNCardsFromDeck(2));
        });
        this.createNextTurn();
    }
    partyWithMinimumRequired(): boolean {
        return this.party.minimumFulfilled;
    }
    takeFlopCards(): void {
        this.table.addCards(...this.deck.getNCardsFromDeck(3));
        this.history.nextRound();
        this.createNextTurn();   
    }
    advanceTurn(turn: TurnData): TurnResponse {
        const { action } = turn;
        switch(action) {
            case FOLD_BET:
                const foldResponse = this.foldAction.execute(turn);
                this.updateCurrentTurnAction(FOLD_BET);
                this.createNextTurn();
                return foldResponse;
            case RAISE_BET:
                const raiseResponse = this.raiseAction.execute(turn);
                if(!raiseResponse.success) {
                    return raiseResponse;
                }
                this.updateCurrentTurnAction(RAISE_BET);                
                this.createNextTurn();
                return raiseResponse;
            case CALL_BET:
                const callResponse = this.callAction.execute(turn);
                if(!callResponse.success) {
                    return callResponse;
                }
                this.updateCurrentTurnAction(CALL_BET);
                this.createNextTurn();
                return callResponse;
            case CHECK_BET:
                const checkResponse = this.checkAction.execute(turn);
                if(!checkResponse.success) return checkResponse;
                this.updateCurrentTurnAction(CHECK_BET);
                this.createNextTurn();
                return checkResponse;                
        }
        return {
            message: 'Unknown action',
            success: false
        };
    }
    playersStillNeedToPlay(): boolean {
        let notNeedToPlay = 1;
        this.party.forEach((p) => {
            if(p.bet >= this.table.bet) {
                notNeedToPlay *= 1;
                return
            };
            notNeedToPlay *= 0
        });
        return notNeedToPlay != 1;
    }
    processWinner(): Player | undefined {
        if(this.party.size == 1) {
            return this.party.at(0)!;
        }
        return undefined;
    }
}