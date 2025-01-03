import EventEmitter from "node:events";
import InvalidAction from "./errors/InvalidAction";
import RejectedAction from "../errors/RejectedAction";
import { FINISH, FLOP, IDLE, PRE_FLOP, RIVER, TURN } from "../poker/symbols/PokerState";
import { NEW_PLAYER, START, WIN } from "../poker/symbols/PokerEvents";
import { Player } from "../poker/Player";
import InvalidType from "./errors/InvalidType";
import PokerError from "../errors/PokerError";
import PartyFull from "../errors/PartyFull";
import { CALL_BET, CHECK_BET, FOLD_BET, RAISE_BET } from "../poker/symbols/PokerBetActions";
import { TurnData } from "../PokerTurn";
import { BetData } from "../dtos/BetData";
import TexasHoldem from "../TexasHoldem";

type AutomataActionResponse = {
    nextState: symbol;
    accepted: boolean;
    message: string;
};

type JumpResponse = {
    state: symbol;
    thenCall?: [symbol, unknown]
}

type AutomataAction = {
    action: (data: unknown) => AutomataActionResponse
}

type AutomataActionMap = {
    [key: symbol]: {
        onEnter?: () => JumpResponse | void;
        on: {
            [key: symbol]: AutomataAction
        }
    }
}

type DispatchResult = {
    message: string;
    success: boolean;
}

export default class PokerAutomata extends EventEmitter {
    private currentState: symbol;
    private states: AutomataActionMap = {
        [IDLE]: {
            on: {
                [NEW_PLAYER]: {
                    action: (data) => {
                        if(!(data instanceof Player)) {
                            throw new InvalidType(Player);
                        }
                        try {
                            this.pokerGame.addPlayer(data);
                            return {
                                accepted: true,
                                message: 'New Player added',
                                nextState: IDLE
                            };
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            if(err instanceof PartyFull) {
                                return {
                                    accepted: false,
                                    message: err.message,
                                    nextState: IDLE
                                }
                            }
                            return {
                                accepted: false,
                                message: err.message,
                                nextState: IDLE
                            };
                        }
                    }
                },
                [START]: {
                    action: () => {
                        if(!this.pokerGame.partyWithMinimumRequired()) {
                            return {
                                accepted: false,
                                message: 'Unsufficient players at the party',
                                nextState: IDLE
                            }
                        }
                        return {
                            accepted: true,
                            message: 'Game will begin',
                            nextState: PRE_FLOP
                        }
                    }
                }
            }
        },
        [PRE_FLOP]: {
            onEnter: () => {
                if(this.currentState != PRE_FLOP) {
                    this.pokerGame.preFlop();
                    return;
                } 
                if(this.pokerGame.partySize == 1) {
                    const winner = this.pokerGame.processWinner()!; 
                    return {
                        state: FINISH,
                        thenCall: [WIN, winner]
                    };
                }
                if(!this.pokerGame.playersStillNeedToPlay() && this.pokerGame.allPartyPlayedOnce) {
                    return {
                        state: FLOP
                    };
                }
            },
            on: {
                [FOLD_BET]: {
                    action: (_: unknown) => {
                        const turn = this.getTurn()!;
                        const player = turn.player;
                        try {
                            const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                                FOLD_BET,
                                0,
                                player
                            ));
                            return {
                                accepted: success,
                                message,
                                nextState: PRE_FLOP
                            }
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                accepted: false,
                                message: err.message,
                                nextState: PRE_FLOP
                            };
                        }
                    }
                },
                [RAISE_BET]: {
                    action: (data: unknown) => {
                        if(!(data instanceof BetData)) {
                            throw new InvalidType(BetData);
                        }
                        const turn = this.getTurn();
                        const player = turn!.player;
                        try {
                            const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                                RAISE_BET,
                                data.value,
                                player
                            ));
                            return {
                                accepted: success,
                                message: message,
                                nextState: PRE_FLOP
                            };
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                message: err.message,
                                accepted: false,
                                nextState: PRE_FLOP
                            }
                        }
                        
                    }
                },
                [CALL_BET]: {
                    action: (_: unknown) => {
                        const turn = this.getTurn();
                        const player = turn!.player;
                        try {
                            const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                                CALL_BET,
                                0,
                                player
                            ));
                            return {
                                accepted: success,
                                message: success ? `Player ${player.name} called`: message,
                                nextState: PRE_FLOP
                            }    
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                message: err.message,
                                accepted: false,
                                nextState: PRE_FLOP
                            }
                        }
                        
                    }
                },
                [CHECK_BET]: {
                    action: (_: unknown) => {
                        try {
                            const { message, success} = this.pokerGame.advanceTurn(new TurnData(CHECK_BET, 0, this.getTurn()!.player));
                            if(!success) {
                                return {
                                    accepted: success,
                                    message,
                                    nextState: CHECK_BET
                                }
                            }
                            return {
                                accepted: true,
                                message: message,
                                nextState: PRE_FLOP
                            }
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                message: err.message,
                                accepted: false,
                                nextState: PRE_FLOP
                            };
                        }
                    }
                }
            }
        },
        [FLOP]: {
            onEnter: () => {
                if(this.currentState != FLOP) {
                    this.pokerGame.flop();
                    return;
                }
                if(this.pokerGame.partySize == 1) {
                    const winner = this.pokerGame.processWinner()!; 
                    return {
                        state: FINISH,
                        thenCall: [WIN, winner]
                    };
                }
                if(!this.pokerGame.playersStillNeedToPlay() && this.pokerGame.allPartyPlayedOnce) {
                    return {
                        state: TURN
                    }
                }
            },
            on: {
                [FOLD_BET]: {
                    action: (_: unknown) => {
                        const turn = this.getTurn()!;
                        const player = turn.player;
                        try {
                            const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                                FOLD_BET,
                                0,
                                player
                            ));
                            return {
                                accepted: success,
                                message,
                                nextState: FLOP
                            }
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                accepted: false,
                                message: err.message,
                                nextState: FLOP
                            };
                        }
                    }
                },
                [RAISE_BET]: {
                    action: (data: unknown) => {
                        if(!(data instanceof BetData)) {
                            throw new InvalidType(BetData);
                        }
                        const turn = this.getTurn();
                        const player = turn!.player;
                        try {
                            const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                                RAISE_BET,
                                data.value,
                                player
                            ));
                            return {
                                accepted: success,
                                message: message,
                                nextState: FLOP
                            };
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                message: err.message,
                                accepted: false,
                                nextState: FLOP
                            }
                        }
                        
                    }
                },
                [CALL_BET]: {
                    action: (_: unknown) => {
                        const turn = this.getTurn();
                        const player = turn!.player;
                        try {
                            const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                                CALL_BET,
                                0,
                                player
                            ));
                            return {
                                accepted: success,
                                message: success ? `Player ${player.name} called`: message,
                                nextState: FLOP
                            }    
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                message: err.message,
                                accepted: false,
                                nextState: FLOP
                            }
                        }
                        
                    }
                },
                [CHECK_BET]: {
                    action: (_: unknown) => {
                        try {
                            const { message, success} = this.pokerGame.advanceTurn(new TurnData(CHECK_BET, 0, this.getTurn()!.player));
                            if(!success) {
                                return {
                                    accepted: success,
                                    message,
                                    nextState: CHECK_BET
                                }
                            }
                            return {
                                accepted: true,
                                message: message,
                                nextState: FLOP
                            }
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                message: err.message,
                                accepted: false,
                                nextState: FLOP
                            };
                        }
                    }
                }
            }
        },
        [TURN]: {
            onEnter: () => {
                if(this.currentState != TURN) {
                    this.pokerGame.goTurn();
                }
                if(this.pokerGame.partySize == 1) {
                    const winner = this.pokerGame.processWinner()!; 
                    return {
                        state: FINISH,
                        thenCall: [WIN, winner]
                    };
                }
                if(!this.pokerGame.playersStillNeedToPlay() && this.pokerGame.allPartyPlayedOnce) {
                    return {
                        state: RIVER
                    }
                }
            },
            on: {
                [FOLD_BET]: {
                    action: (_: unknown) => {
                        const turn = this.getTurn()!;
                        const player = turn.player;
                        try {
                            const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                                FOLD_BET,
                                0,
                                player
                            ));
                            return {
                                accepted: success,
                                message,
                                nextState: TURN
                            }
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                accepted: false,
                                message: err.message,
                                nextState: TURN
                            };
                        }
                    }
                },
                [RAISE_BET]: {
                    action: (data: unknown) => {
                        if(!(data instanceof BetData)) {
                            throw new InvalidType(BetData);
                        }
                        const turn = this.getTurn();
                        const player = turn!.player;
                        try {
                            const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                                RAISE_BET,
                                data.value,
                                player
                            ));
                            return {
                                accepted: success,
                                message: message,
                                nextState: TURN
                            };
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                message: err.message,
                                accepted: false,
                                nextState: TURN
                            }
                        }
                        
                    }
                },
                [CALL_BET]: {
                    action: (_: unknown) => {
                        const turn = this.getTurn();
                        const player = turn!.player;
                        try {
                            const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                                CALL_BET,
                                0,
                                player
                            ));
                            return {
                                accepted: success,
                                message: success ? `Player ${player.name} called`: message,
                                nextState: TURN
                            }    
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                message: err.message,
                                accepted: false,
                                nextState: TURN
                            }
                        }
                        
                    }
                },
                [CHECK_BET]: {
                    action: (_: unknown) => {
                        try {
                            const { message, success} = this.pokerGame.advanceTurn(new TurnData(CHECK_BET, 0, this.getTurn()!.player));
                            if(!success) {
                                return {
                                    accepted: success,
                                    message,
                                    nextState: CHECK_BET
                                }
                            }
                            return {
                                accepted: true,
                                message: message,
                                nextState: TURN
                            }
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                message: err.message,
                                accepted: false,
                                nextState: TURN
                            };
                        }
                    }
                }
            }
        },
        [RIVER]: {
            onEnter: () => {
                if(this.currentState != RIVER) {
                    this.pokerGame.river();
                    return;
                }
                if(this.pokerGame.partySize == 1 || (!this.pokerGame.playersStillNeedToPlay() && this.pokerGame.allPartyPlayedOnce)) {
                    const winner = this.pokerGame.processWinner()!; 
                    return {
                        state: FINISH,
                        thenCall: [WIN, winner]
                    };
                }
            },
            on: {
                [FOLD_BET]: {
                    action: (_: unknown) => {
                        const turn = this.getTurn()!;
                        const player = turn.player;
                        try {
                            const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                                FOLD_BET,
                                0,
                                player
                            ));
                            return {
                                accepted: success,
                                message,
                                nextState: RIVER
                            }
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                accepted: false,
                                message: err.message,
                                nextState: RIVER
                            };
                        }
                    }
                },
                [RAISE_BET]: {
                    action: (data: unknown) => {
                        if(!(data instanceof BetData)) {
                            throw new InvalidType(BetData);
                        }
                        const turn = this.getTurn();
                        const player = turn!.player;
                        try {
                            const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                                RAISE_BET,
                                data.value,
                                player
                            ));
                            return {
                                accepted: success,
                                message: message,
                                nextState: RIVER
                            };
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                message: err.message,
                                accepted: false,
                                nextState: RIVER
                            }
                        }
                        
                    }
                },
                [CALL_BET]: {
                    action: (_: unknown) => {
                        const turn = this.getTurn();
                        const player = turn!.player;
                        try {
                            const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                                CALL_BET,
                                0,
                                player
                            ));
                            return {
                                accepted: success,
                                message: success ? `Player ${player.name} called`: message,
                                nextState: RIVER
                            }    
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                message: err.message,
                                accepted: false,
                                nextState: RIVER
                            }
                        }
                        
                    }
                },
                [CHECK_BET]: {
                    action: (_: unknown) => {
                        try {
                            const { message, success} = this.pokerGame.advanceTurn(new TurnData(CHECK_BET, 0, this.getTurn()!.player));
                            if(!success) {
                                return {
                                    accepted: success,
                                    message,
                                    nextState: CHECK_BET
                                }
                            }
                            return {
                                accepted: true,
                                message: message,
                                nextState: RIVER
                            }
                        } catch(err: unknown) {
                            if(!(err instanceof PokerError)) {
                                throw err;
                            }
                            return {
                                message: err.message,
                                accepted: false,
                                nextState: RIVER
                            };
                        }
                    }
                }
            }
        },
        [FINISH]: {
            on: {
                [WIN]: {
                    action: (data: unknown) => {
                        if(!(data instanceof Player)) {
                            throw new InvalidType(Player);
                        }
                        return {
                            accepted: true,
                            message: `Player ${data} won!`,
                            nextState: FINISH
                        }
                    }
                }
            }
        }
    }
    private pokerGame: TexasHoldem;
    constructor(pokerGame: TexasHoldem) {
        super();
        this.currentState = IDLE;
        this.pokerGame = pokerGame;
    }
    get state() {
        return this.currentState;
    }
    private getHandler(action: symbol): AutomataAction {  
        const { on } = this.states[this.currentState];
        return on[action];
    }
    private advanceTo(nextState: symbol): void {
        const next = this.states[nextState];
        const { onEnter } = next;
        if(onEnter) {
            const jump = onEnter();
            if(jump) {
                return this.executeJump(jump);
            }
        }
        this.currentState = nextState;
        return;
    }
    private executeJump({state, thenCall}: JumpResponse): void {
        this.advanceTo(state);
        if(thenCall) {
            this.dispatch(thenCall[0], thenCall[1]);
        }
    }
    public getTurn() {
        return this.pokerGame.turn;
    }
    public dispatch(action: symbol, data: unknown): DispatchResult {
        const automataAction = this.getHandler(action);
        if(typeof automataAction === 'undefined') {
            throw new InvalidAction(action);
        }
        const { action: handler } = automataAction;
        try {
            const { accepted, message, nextState } = handler(data);
            if(!accepted) throw new RejectedAction(message);
            this.advanceTo(nextState);
            return {
                message,
                success: accepted
            };
        } catch(err: unknown) {
            if(err instanceof Error) {
                return {
                    message: err.message,
                    success: false
                };
            }
            throw err;
        }
    }
}