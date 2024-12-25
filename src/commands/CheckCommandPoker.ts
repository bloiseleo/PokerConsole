import { CHECK_BET } from "../models/PokerBetActions";
import PokerAutomata from "../PokerAutomata";
import Command from "./Command";

export class CheckCommandPoker extends Command<PokerAutomata> {
    async run(data: PokerAutomata): Promise<boolean> {
        const { message, success } = data.dispatch(CHECK_BET, undefined);
        if(!success) {
            await this.errorMessage(message);
            return false;
        }
        await this.successMessage(message);
        return success;
    }
}