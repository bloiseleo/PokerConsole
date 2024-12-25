import EventEmitter from "node:events";
import { FLOP, IDLE, PRE_FLOP } from "./models/PokerState";
import { NEW_PLAYER, START } from "./models/PokerEvents";
import RejectedAction from "./errors/RejectedAction";
import PokerGame from "./models/PokerGame";
import { Player } from "./models/Player";
import PokerError from "./errors/PokerError";
import PartyFull from "./errors/PartyFull";
import { TurnData } from "./PokerTurn";
import { CALL_BET, CHECK_BET, FOLD_BET, RAISE_BET } from "./models/PokerBetActions";
import { BetData } from "./dtos/BetData";

type AutomataActionResponse = {
    nextState: symbol;
    accepted: boolean;
    message: string;
};

type JumpResponse = {
    state: symbol;
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
                            throw new Error('NEW_PLAYER must receive a Player instance');
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
                    this.pokerGame.preFloop();
                    return;
                }
                if(!this.pokerGame.playersStillNeedToPlay() && this.pokerGame.allPlayersPlayedAlready) {
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
                    }
                },
                [RAISE_BET]: {
                    action: (data: unknown) => {
                        if(!(data instanceof BetData)) {
                            return {
                                message: 'Data must be instance of BetData',
                                accepted: false,
                                nextState: PRE_FLOP
                            };
                        }
                        const turn = this.getTurn();
                        const player = turn!.player;
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
                    }
                },
                [CALL_BET]: {
                    action: (_: unknown) => {
                        const turn = this.getTurn();
                        const player = turn!.player;
                        const { message, success } = this.pokerGame.advanceTurn(new TurnData(
                            CALL_BET,
                            0,
                            player
                        ));
                        return {
                            accepted: success,
                            message: success ? 'Bet accepted': message,
                            nextState: PRE_FLOP
                        }
                    }
                },
                [CHECK_BET]: {
                    action: (_: unknown) => {
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
                            message: 'Bet accepted',
                            nextState: PRE_FLOP
                        }
                    }
                }
            }
        },
        [FLOP]: {
            onEnter() {
                console.log('Entered!');
            },
            on: {}
        }
    }
    private pokerGame: PokerGame;
    constructor(pokerGame: PokerGame) {
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
                return this.advanceTo(jump.state);
            }
        }
        this.currentState = nextState;
        return;
    }
    public getTurn() {
        return this.pokerGame.turn;
    }
    public dispatch(action: symbol, data: unknown): DispatchResult {
        const automataAction = this.getHandler(action);
        if(typeof automataAction === 'undefined') {
            throw new Error('Invalid action ' + action.toString());
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