import Terminal from "../helpers/Terminal";
import AddPlayerToPokerCommand from "./AddPlayerToPoker";
import CallCommandPoker from "./CallCommandPoker";
import { CheckCommandPoker } from "./CheckCommandPoker";
import { FoldCommandPoker } from "./FoldCommandPoker";
import RaiseBetCommandPoker from "./RaiseBetCommandPoker";
import StartPoker from "./StartPoker";

export const idleCommands = (terminal: Terminal) => [
    new AddPlayerToPokerCommand("Add Player", "Add a new player to the poker game", terminal),
    new StartPoker('Start', 'Start the game', terminal),
];

export const preFloopCommands = (terminal: Terminal) => [
    new CallCommandPoker('Call', 'Bet the last value of the last player', terminal),
    new CheckCommandPoker('Check', 'Keep it', terminal),
    new RaiseBetCommandPoker('Raise', 'Raise your bet', terminal),
    new FoldCommandPoker('Fold', 'Give up!', terminal)
];