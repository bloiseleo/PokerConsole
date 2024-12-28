export default class PokerSuccessView {
    constructor(private data: string) {} 
    toString() {
        return this.data;
    }
    static load(message: string = '') {
        return new PokerSuccessView(`
            / ____| |  | |/ ____/ ____|  ____|/ ____/ ____|
           | (___ | |  | | |   | |    | |__  | (___| (___  
            \___ \| |  | | |   | |    |  __|  \___ \\___ \ 
             ____) | |__| | |___| |____| |____ ____) |___) |
            |_____/ \____/ \_____\_____|______|_____/_____/ 
           ☉ ‿ ⚆ ${message !== "" ? " - " + message: message}
       `);
    }
}