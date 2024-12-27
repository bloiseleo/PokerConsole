import { Player } from "./poker/Player";
import { CALL_BET, CHECK_BET, FOLD_BET, RAISE_BET } from "./models/PokerBetActions";
import Party from "./poker/Party";
import { PokerTurn, TurnData, TurnResponse } from "./PokerTurn";
import Deck from "./poker/Deck";
import Table from "./poker/Table";
import RoundHistory from "./poker/RoundHistory";

export default class TexasHoldem {
    private history: RoundHistory;
    constructor(
        private party: Party,
        private deck: Deck,
        private table: Table
    ) { 
        this.history = new RoundHistory(party);
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
    }
    advanceTurn(turn: TurnData): TurnResponse {
        const { action, player, value } = turn;
        switch(action) {
            case FOLD_BET:
                this.party.removePlayer(player);
                this.updateCurrentTurnAction(FOLD_BET);
                this.createNextTurn();
                return {
                    message: `Player ${player.name} folded`,
                    success: true
                };
            case RAISE_BET:
                if(value <= 0) {
                    return {
                        message: `The value must be positive. ${value} provided`,
                        success: false
                    };
                }
                const total = player.bet + value;
                if(total <= this.table.bet) {
                    return {
                        message: `Insufficient Value ${total}`,
                        success: false
                    };
                }
                player.charge(value);
                this.table.addToPot(value);
                this.table.saveBiggestBet(player.bet);
                this.updateCurrentTurnAction(RAISE_BET);                
                this.createNextTurn();
                return {
                    message: `Player ${player.name} raised!`,
                    success: true
                };
            case CALL_BET:
                if(player.bet >= this.table.bet) {
                    return {
                        message: `Player ${player.name} cannot call!`,
                        success: false
                    }
                }
                const valueToReachTableValue = this.table.bet - player.bet;
                player.charge(valueToReachTableValue);                
                this.table.addToPot(valueToReachTableValue);
                this.updateCurrentTurnAction(CALL_BET);
                this.createNextTurn();
                return {
                    message: `Player ${player.name} called!`,
                    success: true
                };
            case CHECK_BET:
                if(player.bet != this.table.bet) {
                    return {
                        message: `Player ${player.name} cannot check`,
                        success: false
                    };
                }
                this.updateCurrentTurnAction(CHECK_BET);
                this.createNextTurn();
                return {
                    message: `Player ${player.name} checked`,
                    success: true
                };
            default:
                return {
                    message: 'Unknown action',
                    success: false
                }
                
        }
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