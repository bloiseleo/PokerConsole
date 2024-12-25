import PokerAutomata from "./src/PokerAutomata";
import TexasHoldem from "./src/TexasHoldem";
import { idleCommands, preFloopCommands } from './src/commands';
import Command from "./src/commands/Command";
import Terminal from "./src/helpers/Terminal";
import { FLOP, IDLE, PRE_FLOP } from "./src/models/PokerState";

const game = new TexasHoldem();

const poker = new PokerAutomata(
    game
);
const terminal = new Terminal();
const ic = idleCommands(terminal);
const pfCommands = preFloopCommands(terminal);

async function executeCommand(command: Command<PokerAutomata>) {
    console.clear();
    await command.run(poker);
}

(async () => {
    while(true) {
        switch(poker.state) {
            case IDLE:
                terminal.displayIdleBadge(poker, game);
                const command = await terminal.displayList(ic);
                await executeCommand(command);
                console.clear();
                break;
            case PRE_FLOP:
                terminal.displayPreFlopBadge(poker, game);
                terminal.newLine();
                const preFloopCommand = await terminal.displayList(pfCommands);
                await executeCommand(preFloopCommand);
                console.clear();
                break;
            case FLOP:
                terminal.displayFlopBadge(poker, game);
                terminal.newLine();
                await terminal.displayList(pfCommands);
                break;
        }
    }
})();

