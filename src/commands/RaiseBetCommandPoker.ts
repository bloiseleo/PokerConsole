import { BetData } from "../dtos/BetData";
import { RAISE_BET } from "../models/PokerBetActions";
import PokerAutomata from "../PokerAutomata";
import Command from "./Command";

export default class RaiseBetCommandPoker extends Command<PokerAutomata> {
    async run(data: PokerAutomata): Promise<boolean> {
        let valueSelected: number = 0;
        while(true) {
            const value = await this.terminal.input("Which value do you want to bet?");
            const numberValue = Number.parseFloat(value);
            if(Number.isNaN(numberValue) || numberValue <= 0) {
                await this.errorMessage(`Invalid value`);
                continue;
            }
            valueSelected = numberValue;
            break;
        };
        const { success, message } = data.dispatch(RAISE_BET, new BetData(valueSelected));
        if(!success) {
            await this.errorMessage(message);
            return false;
        }
        await this.successMessage(message);
        return success
    }
}