import Terminal from '../helpers/Terminal';
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
    protected async successMessage(message: string = "") {
        this.terminal.message(`
            / ____| |  | |/ ____/ ____|  ____|/ ____/ ____|
           | (___ | |  | | |   | |    | |__  | (___| (___  
            \___ \| |  | | |   | |    |  __|  \___ \\___ \ 
             ____) | |__| | |___| |____| |____ ____) |___) |
            |_____/ \____/ \_____\_____|______|_____/_____/ 
           ☉ ‿ ⚆ ${message !== "" ? " - " + message: message}
       `);
       await this.completeAfter(3);  
    }
    protected async errorMessage(message: string = "") {
        this.terminal.message(`
     ░        ░░       ░░░       ░░░░      ░░░       ░░
     ▒  ▒▒▒▒▒▒▒▒  ▒▒▒▒  ▒▒  ▒▒▒▒  ▒▒  ▒▒▒▒  ▒▒  ▒▒▒▒  ▒
     ▓      ▓▓▓▓       ▓▓▓       ▓▓▓  ▓▓▓▓  ▓▓       ▓▓
     █  ████████  ███  ███  ███  ███  ████  ██  ███  ██
     █        ██  ████  ██  ████  ███      ███  ████  █   
     	(⌐■_■) ${message == '' ? message: ' - ' + message}
        `)
        await this.completeAfter(3);
    }
}