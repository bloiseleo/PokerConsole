import { Player } from "../poker/Player";
import Command from "./Command";
import { NEW_PLAYER } from "../models/PokerEvents";
import Wallet from "../poker/Wallet";
import PokerAutomata from "../automata/PokerAutomata";

export default class AddPlayerToPokerCommand extends Command<PokerAutomata> {
    private static counter = 0;
    async run(data: PokerAutomata): Promise<boolean> {
        this.terminal.clear();
        const playerName = await this.terminal.input('What\'s your name?');
        const player = new Player(AddPlayerToPokerCommand.counter++, playerName, new Wallet(200));
        const { message, success } = data.dispatch(NEW_PLAYER, player);
        if(!success) {
            await this.errorMessage(message);
            return false;
        }
        await this.successMessage(message);
        return success;
    }
}