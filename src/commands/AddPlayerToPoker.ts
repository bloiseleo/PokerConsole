import { Player } from "../models/Player";
import PokerAutomata from "../PokerAutomata";
import Command from "./Command";
import { NEW_PLAYER } from "../models/PokerEvents";

export default class AddPlayerToPokerCommand extends Command<PokerAutomata> {
    private static counter = 0;
    async run(data: PokerAutomata): Promise<boolean> {
        this.terminal.clear();
        const playerName = await this.terminal.input('What\'s your name?');
        const player = new Player(AddPlayerToPokerCommand.counter++, playerName);
        const { message, success } = data.dispatch(NEW_PLAYER, player);
        if(!success) {
            console.error(message);
        } else {
            console.log(message);
        }
        return success;
    }
}