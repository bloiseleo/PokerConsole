import PokerAutomata from "../automata/PokerAutomata";
import { CALL_BET } from "../poker/symbols/PokerBetActions";
import Command from "./Command";

export default class CallCommandPoker extends Command<PokerAutomata> {
    async run(data: PokerAutomata): Promise<boolean> {
        const { message, success } = data.dispatch(CALL_BET, undefined);
        if(!success) {
            await this.errorMessage(message);
            return false;
        }
        await this.successMessage(message);
        return success;
    }
}