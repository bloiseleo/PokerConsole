import { FOLD_BET } from "../models/PokerBetActions";
import PokerAutomata from "../PokerAutomata";
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