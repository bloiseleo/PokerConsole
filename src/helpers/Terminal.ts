import { createInterface, Interface } from "readline/promises";
import Command from "../commands/Command";
import { FLOP, IDLE, PRE_FLOP } from "../models/PokerState";
import PokerAutomata from "../PokerAutomata";
import PokerGame from "../models/PokerGame";
import { Player } from "../models/Player";

export default class Terminal {
    private readline: Interface;
    constructor() {
        this.readline = this.createReadline();
    }
    private createReadline() {
        return createInterface(process.stdin, process.stderr);
    }
    translateFromSymbol(s: symbol): string {
        switch(s) {
            case IDLE:
                return "Waiting for players to complete the party";
            case PRE_FLOP:
                return "Pre-Flop";
            case FLOP:
                return "Flop";
            default:
                return "Unknown Status";
        }
    }
    private displayBanner() {
        this.message(`
            ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄    ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄ 
           ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌  ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
           ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌ ▐░▌ ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌
           ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌▐░▌  ▐░▌          ▐░▌       ▐░▌
           ▐░█▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌▐░▌░▌   ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌
           ▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░▌    ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
           ▐░█▀▀▀▀▀▀▀▀▀ ▐░▌       ▐░▌▐░▌░▌   ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀█░█▀▀ 
           ▐░▌          ▐░▌       ▐░▌▐░▌▐░▌  ▐░▌          ▐░▌     ▐░▌  
           ▐░▌          ▐░█▄▄▄▄▄▄▄█░▌▐░▌ ▐░▌ ▐░█▄▄▄▄▄▄▄▄▄ ▐░▌      ▐░▌ 
           ▐░▌          ▐░░░░░░░░░░░▌▐░▌  ▐░▌▐░░░░░░░░░░░▌▐░▌       ▐░▌
            ▀            ▀▀▀▀▀▀▀▀▀▀▀  ▀    ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀   
               `);
    }
    displayIdleBadge(poker: PokerAutomata, game: PokerGame) {
        this.displayBanner();
        const currentPlayers = game.getPlayers().join(', ');
        this.message('Current State: ' + this.translateFromSymbol(poker.state));
        this.message('Players: ' + (currentPlayers == "" ? 'Empty': currentPlayers));
        this.newLine();
    }
    displayPreFloopBadge(poker: PokerAutomata, game: PokerGame) {
        this.displayIdleBadge(poker, game);
        const turn = poker.getTurn();
        if(turn) {
            const player = turn.player;
            const hand = player.hand.map(card => card.toString()).join(', ');
            this.message(`Your hand: ${hand}`);
        }
        this.message('Current turn: ' + poker.getTurn()?.player.name);
        const players = game.getPlayers();
        this.message('Pot: ' + game.pot);
        this.newLine();
        this.displayBets(players);
    }
    displayFloopBadge(poker: PokerAutomata, game: PokerGame) {
        this.displayPreFloopBadge(poker, game);
    }
    private displayBets(players: Player[]) {
        this.message('BETS');
        this.message(players.map(p => `${p.name}: R$ ${p.chargedMoney.toFixed(2)}`).join('\n'))
    }
    async displayList(options: Command<unknown>[]): Promise<Command<unknown>> {
        let message = "";
        options.forEach((option, index) => {
            message += `${index + 1} - ${option.name} | ${option.description}\n`;
        });
        let command: Command<unknown> | undefined = undefined;
        while(true){
            const anwser = await this.readline.question(this.appendAnwserBadge(message));
            const parsed = Number.parseInt(anwser, 10);
            if(!Number.isNaN(parsed) && (parsed >= 1 && parsed <= options.length + 1)) {
                command = options.at(parsed - 1) as Command<unknown>;
                break;
            }
            console.error(`Invalid option! Try again...`);
        }
        return command as Command<unknown>;
    }
    clear() {
        console.clear();
    }
    async input(message: string): Promise<string> {
        return await this.readline.question(this.appendAnwserBadge(message));
    }
    private appendAnwserBadge(message: string): string {
        return message + '\n' + 'Anwser: ';
    }
    newLine() {
        console.log('\n');
    }
    message(message: string) {
        console.log(message);
    }
    error(message: string) {
        this.message('ERROR: ' + message);
    }
}