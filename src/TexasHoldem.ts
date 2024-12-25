import PartyFull from "./errors/PartyFull";
import PlayerAlreadyInParty from "./errors/PlayerAlreadyInParty";
import { Player } from "./models/Player";
import { CALL_BET, CHECK_BET, FOLD_BET, RAISE_BET } from "./models/PokerBetActions";
import PokerCard from "./models/PokerCard";
import PokerGame from "./models/PokerGame";
import { PokerTurn, TurnData, TurnResponse } from "./PokerTurn";

export default class TexasHoldem implements PokerGame {
    private players: Map<string, Player> = new Map();
    private deck: PokerCard[];
    private lastTurn?: PokerTurn = undefined;
    private currentTurn?: PokerTurn = undefined;
    private playerList: Player[] = [];
    private currentTurnIndex: number = 0;
    private allPlayersPlayed = false;
    private tableValue: number = 0;
    private biggestBet: number = Number.MIN_SAFE_INTEGER;
    constructor() {
        this.deck = PokerCard.generateDefault();
    }
    private removePlayer(id: string): void {
        this.players.delete(id);
    }
    playersStillNeedToPlay(): boolean {
        let stillNeedToPlay = this.players.size;
        this.players.forEach((p) => {
            if(p.chargedMoney >= this.biggestBet) {
                stillNeedToPlay--
            };
        });
        return stillNeedToPlay > 0;
    }
    getPlayers(): Player[] {
        const players: Player[] = []
        this.players.forEach((p) => {
            players.push(p);
        });
        return players;
    }
    get allPlayersPlayedAlready() {
        return this.allPlayersPlayed;
    }
    get bigBlind(): number {
        return 10;
    }
    get smallBlind(): number {
        return 5;
    }
    get partyCapacity(): number {
        return 5;
    }
    get turn(): PokerTurn | undefined {
        return this.currentTurn;
    }
    public addPlayer(player: Player): void {
        if(this.players.size == this.partyCapacity) {
            throw new PartyFull();
        }
        if(this.players.has(player.id.toString())) {
            throw new PlayerAlreadyInParty(player.id);
        }
        this.players.set(player.id.toString(), player);
    }
    private getCardFromDeck() {
        const cardDeckIndex = Math.floor(Math.random() * this.deck.length);
        const card = this.deck[cardDeckIndex];
        this.deck = this.deck.filter((_, cardIndex) => cardIndex !== cardDeckIndex);
        return card;
    }
    partyAlreadyFull(): boolean {
        return this.partyCapacity == this.players.size;
    }
    private addToTableValue(value: number) {
        this.tableValue += value;
    }
    private createPlayerArray() {
        this.players.forEach(p => {
            this.playerList.push(p);
        });
    }
    preFloop(): void {
        this.players.forEach((player) => {
            let ri = Math.random();
            for(let i = 0; i < 2; i++) player.hand.push(this.getCardFromDeck());
            if(ri >= 0.5) {
                player.chargeBlind(this.bigBlind);
                this.addToTableValue(this.bigBlind);
                this.saveBiggestBet(this.bigBlind);
            } else {
                player.chargeBlind(this.smallBlind);
                this.addToTableValue(this.smallBlind);
                this.saveBiggestBet(this.smallBlind);
            }
        });
        this.createPlayerArray();
        this.createNextTurn(undefined);
    }
    partyWithMinimumRequired(): boolean {
        return this.players.size >= 2;
    }
    private saveBiggestBet(bet: number): void {
        if(this.biggestBet < bet) {
            this.biggestBet = bet;
        }
    }
    private createNextTurn(action?: symbol) {
        if(this.currentTurnIndex >= this.playerList.length) {
            this.currentTurnIndex = 0;
            this.allPlayersPlayed = true;
        }
        this.currentTurn = new PokerTurn(
            this.playerList.at(this.currentTurnIndex++)!,
            action
        );
    }
    advanceTurn(turn: TurnData): TurnResponse {
        const { action, player, value } = turn;
        switch(action) {
            case FOLD_BET:
                this.removePlayer(player.id.toString());
                this.createNextTurn(undefined);
                return {
                    message: `Player ${player.name} folded`,
                    success: true
                };
            case RAISE_BET:
                if(value <= 0) {
                    return {
                        message: 'The value must be positive',
                        success: false
                    };
                }
                const total = player.chargedMoney + value;
                if(total <= this.biggestBet) {
                    return {
                        message: 'Insufficient Value',
                        success: false
                    };
                }
                player.charge(value);
                this.addToTableValue(value);
                this.saveBiggestBet(player.chargedMoney)
                this.lastTurn = new PokerTurn(player, RAISE_BET);
                this.createNextTurn(undefined);
                return {
                    message: `Player ${player.name} raised!`,
                    success: true
                };
            case CALL_BET:
                if(player.chargedMoney >= this.biggestBet) {
                    return {
                        message: 'You cannot call',
                        success: false
                    }
                }
                const valueToReachTableValue = this.biggestBet - player.chargedMoney;
                player.charge(valueToReachTableValue);
                this.addToTableValue(valueToReachTableValue);
                this.saveBiggestBet(player.chargedMoney);
                this.lastTurn = new PokerTurn(player, CALL_BET);
                this.createNextTurn(undefined);
                return {
                    message: `Player ${player.name} called!`,
                    success: true
                };
            case CHECK_BET:
                if(player.chargedMoney != this.biggestBet) {
                    return {
                        message: 'You cannot check',
                        success: false
                    };
                }
                this.lastTurn = new PokerTurn(player, CHECK_BET);
                this.createNextTurn(undefined);
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
    resetTurn(): void {
        this.allPlayersPlayed = false;
        this.currentTurnIndex = 0;
        this.createNextTurn(undefined);
    }
    getLastTurn() {
        return this.lastTurn;
    }
    get pot() {
        return this.tableValue;
    }
}