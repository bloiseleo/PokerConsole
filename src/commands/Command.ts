import Terminal from '../helpers/Terminal';
import PokerErrorView from '../view/PokerErrorView';
import PokerSuccessView from '../view/PokerSuccessView';
export default abstract class Command<T> {
    constructor(
        public name: string,
        public description: string,
        protected terminal: Terminal
    ) {
    }
    abstract run(data: T): Promise<boolean>;
    protected completeAfter(delay: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                return resolve();
            }, delay * 1000);
        });
    } 
    protected buildErrorMessage(error: string): PokerErrorView {
        return PokerErrorView.load(error);
    }
    protected buildSuccessMessage(message: string): PokerSuccessView {
        return PokerSuccessView.load(message);
    }
    protected async errorMessage(message: string) {
        this.terminal.message(this.buildErrorMessage(message));
        await this.completeAfter(3);
    }
    protected async successMessage(message: string) {
        this.terminal.message(this.buildSuccessMessage(message));
        await this.completeAfter(3);
    }
}