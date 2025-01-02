import PokerAutomata from "../automata/PokerAutomata";
import { FOLD_BET } from "../poker/symbols/PokerBetActions";
import Command from "./Command";

export class FoldCommandPoker extends Command<PokerAutomata> {
    async run(data: PokerAutomata): Promise<boolean> {
        const turn = data.getTurn()!;
        const player = turn.player;
        const { message, success } = data.dispatch(FOLD_BET,player);
        if(!success) {
            await this.errorMessage(message);
            return false;
        }
        await this.successMessage(message);
        return success;
    }
}