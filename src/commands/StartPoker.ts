import PokerAutomata from "../automata/PokerAutomata";
import { START } from "../models/PokerEvents";
import Command from "./Command";

export default class StartPoker extends Command<PokerAutomata> {
    async run(data: PokerAutomata): Promise<boolean> {
        const { message, success } = data.dispatch(START, undefined);
        this.terminal.message(message);
        this.terminal.message("You'll return to the menu in 3 seconds...");
        await this.completeAfter(3);
        return success;
    }
}